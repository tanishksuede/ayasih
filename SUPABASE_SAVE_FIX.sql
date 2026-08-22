-- ============================================================
-- FIX: users_update_own RLS policy
-- Allows both:
-- 1. Users with auth_user_id set (Google login users)
-- 2. Users with auth_user_id = NULL (mobile/legacy users whose session matches via Supabase Auth email-password derived from phone)
-- ============================================================

-- Step 1: Drop the broken policy
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Step 2: Create a helper function that resolves the current user's public.users.id from their Supabase auth session
-- (works for BOTH Google users and mobile-derived email/password users)
CREATE OR REPLACE FUNCTION public.get_auth_user_row_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
  SELECT id
  FROM public.users
  WHERE auth_user_id = auth.uid() -- Google / OAuth users
  UNION ALL
  SELECT id
  FROM public.users u
  JOIN auth.users au ON au.email = u.email -- mobile email-derived users
  WHERE au.id = auth.uid()
    AND u.auth_user_id IS NULL
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_user_row_id() TO authenticated;

-- Step 3: New policy — allows update if user's id matches resolved row
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    -- Case 1: auth_user_id is set and matches (Google/OAuth users)
    auth_user_id = auth.uid()
    OR
    -- Case 2: auth_user_id is NULL but email matches Supabase Auth email
    -- (mobile users with phone-derived email passwords)
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

-- Step 4: Also fix personality_profiles — same issue may exist there
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

    -- Allow users to read and write their own profile
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

-- Step 5: Fix game_sessions table — ensure columns exist that the code tries to insert
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

    -- RLS for game_sessions
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

-- Step 6: Verify the fix — run this and confirm your user row appears
-- Replace 'your-email@example.com' with your own login email to test
-- SELECT id, email, auth_user_id, total_xp FROM public.users WHERE email = 'your-email@example.com';

-- Step 7: Backfill auth_user_id for existing users where possible
-- This is a one-time migration. It links existing public.users rows to their Supabase Auth rows where email matches.
UPDATE public.users u
SET auth_user_id = au.id
FROM auth.users au
WHERE au.email = u.email
  AND u.auth_user_id IS NULL;

-- Report how many rows were updated
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM public.users
  WHERE auth_user_id IS NOT NULL;
  RAISE NOTICE 'Users with auth_user_id set: %', updated_count;
END $$;
