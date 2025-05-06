
-- Improved is_admin function with proper error handling
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in is_admin function: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Helper function to get user role safely
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_user_role function: %', SQLERRM;
    RETURN NULL;
END;
$$;

-- Function to check if user is midwife
CREATE OR REPLACE FUNCTION public.is_midwife()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'midwife' OR role = 'admin')
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in is_midwife function: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Function to check if user is supervisor
CREATE OR REPLACE FUNCTION public.is_supervisor()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'supervisor' OR role = 'admin')
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in is_supervisor function: %', SQLERRM;
    RETURN FALSE;
END;
$$;
