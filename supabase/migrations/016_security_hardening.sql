-- Apply in the Supabase SQL editor after reviewing. This migration does not delete user data.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read own record" ON public.admin_users;
DROP POLICY IF EXISTS "No direct read via anon" ON public.admin_users;
CREATE POLICY "No direct read via anon" ON public.admin_users FOR SELECT TO authenticated USING (FALSE);

-- The supplied RPC pattern is bound to auth.jwt() so a caller cannot claim another admin email.
CREATE OR REPLACE FUNCTION public.is_admin_user(check_email TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN check_email = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE email = LOWER(TRIM(check_email)));
END;
$$;

CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin_user(LOWER(COALESCE(auth.jwt() ->> 'email', ''))) THEN RAISE EXCEPTION 'not authorized'; END IF;
  RETURN QUERY SELECT au.id, au.email, au.created_at FROM public.admin_users au ORDER BY au.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.manage_admin_user(action TEXT, target_email TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE caller TEXT := LOWER(COALESCE(auth.jwt() ->> 'email', ''));
BEGIN
  IF NOT public.is_admin_user(caller) THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF action = 'add' THEN INSERT INTO public.admin_users(email) VALUES (LOWER(TRIM(target_email))) ON CONFLICT (email) DO NOTHING;
  ELSIF action = 'remove' AND LOWER(TRIM(target_email)) <> 'anitadhakad333@gmail.com' THEN DELETE FROM public.admin_users WHERE email = LOWER(TRIM(target_email));
  ELSE RAISE EXCEPTION 'invalid admin action'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_push_subscription_count()
RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin_user(LOWER(COALESCE(auth.jwt() ->> 'email', ''))) THEN RAISE EXCEPTION 'not authorized'; END IF;
  RETURN (SELECT COUNT(*) FROM public.push_subscriptions);
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin_user(TEXT), public.list_admin_users(), public.manage_admin_user(TEXT, TEXT), public.get_push_subscription_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user(TEXT), public.list_admin_users(), public.manage_admin_user(TEXT, TEXT), public.get_push_subscription_count() TO authenticated;
