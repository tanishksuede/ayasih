-- Migration 016: Supabase Save Fix for Mobile Users & Game Sessions RLS
-- Fixes RLS policies for users with auth_user_id IS NULL (mobile phone logins)

-- Step 1: Drop broken policy
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Step 2: Create helper function
CREATE OR REPLACE FUNCTION public.get_auth_user_row_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
  SELECT id
  FROM public.users
  WHERE auth_user_id = auth.uid()
  UNION ALL
  SELECT id
  FROM public.users u
  JOIN auth.users au ON au.email = u.email
  WHERE au.id = auth.uid()
    AND u.auth_user_id IS NULL
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_row_id() TO authenticated;

-- Step 3: New policy on users table
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR
    (
      auth_user_id IS NULL
      AND id = public.get_auth_user_row_id()
    )
  )
  WITH CHECK (
    auth_user_id = auth.uid()
    OR
    (
      auth_user_id IS NULL
      AND id = public.get_auth_user_row_id()
    )
  );

-- Step 4: Fix personality_profiles policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'personality_profiles'
  ) THEN
    ALTER TABLE public.personality_profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "personality_profiles_update_own" ON public.personality_profiles;
    DROP POLICY IF EXISTS "personality_profiles_upsert_own" ON public.personality_profiles;
    DROP POLICY IF EXISTS "personality_profiles_insert_own" ON public.personality_profiles;
    DROP POLICY IF EXISTS "personality_profiles_select_own" ON public.personality_profiles;

    CREATE POLICY "personality_profiles_select_own"
      ON public.personality_profiles
      FOR SELECT
      TO authenticated
      USING (user_id = public.get_auth_user_row_id());

    CREATE POLICY "personality_profiles_insert_own"
      ON public.personality_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = public.get_auth_user_row_id());

    CREATE POLICY "personality_profiles_update_own"
      ON public.personality_profiles
      FOR UPDATE
      TO authenticated
      USING (user_id = public.get_auth_user_row_id())
      WITH CHECK (user_id = public.get_auth_user_row_id());
  END IF;
END $$;

-- Step 5: Fix game_sessions table & RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'game_sessions'
  ) THEN
    ALTER TABLE public.game_sessions
      ADD COLUMN IF NOT EXISTS level_id TEXT,
      ADD COLUMN IF NOT EXISTS selected_personality TEXT,
      ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS match_score INTEGER DEFAULT 0;

    ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "game_sessions_insert_own" ON public.game_sessions;
    DROP POLICY IF EXISTS "game_sessions_select_own" ON public.game_sessions;

    CREATE POLICY "game_sessions_insert_own"
      ON public.game_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (
        user_id IS NULL
        OR user_id = public.get_auth_user_row_id()
      );

    CREATE POLICY "game_sessions_select_own"
      ON public.game_sessions
      FOR SELECT
      TO authenticated
      USING (
        user_id IS NULL
        OR user_id = public.get_auth_user_row_id()
      );
  END IF;
END $$;

-- Step 6: Backfill auth_user_id for existing users
UPDATE public.users u
SET auth_user_id = au.id
FROM auth.users au
WHERE au.email = u.email
  AND u.auth_user_id IS NULL;
