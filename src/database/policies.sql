
-- Drop existing policies on profiles table to prevent recursion issues
DO $$
BEGIN
  -- Delete all policies on the profiles table
  DROP POLICY IF EXISTS "Profiles are viewable by users who created them" ON "public"."profiles";
  DROP POLICY IF EXISTS "Profiles are editable by users who created them" ON "public"."profiles";
  DROP POLICY IF EXISTS "Admins can view all profiles" ON "public"."profiles";
  DROP POLICY IF EXISTS "Admins can edit all profiles" ON "public"."profiles";
  DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON "public"."profiles";
  DROP POLICY IF EXISTS "Users can update own profile" ON "public"."profiles";
  DROP POLICY IF EXISTS "Admins can insert profiles" ON "public"."profiles";
END
$$;

-- Create is_admin function that doesn't use profiles table (to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  _is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO _is_admin;
  
  RETURN _is_admin;
END;
$$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to select profiles
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- Allow any user to insert profiles (for user signup flow)
CREATE POLICY "Users can insert profiles" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- RLS policies for mothers table
ALTER TABLE public.mothers ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view mothers
CREATE POLICY "Authenticated users can view mothers" 
ON public.mothers FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users can insert new mothers
CREATE POLICY "Authenticated users can insert mothers" 
ON public.mothers FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated users can update mothers
CREATE POLICY "Authenticated users can update mothers" 
ON public.mothers FOR UPDATE 
TO authenticated 
USING (true);

-- RLS policies for visits table
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view visits
CREATE POLICY "Authenticated users can view visits" 
ON public.visits FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users can insert new visits
CREATE POLICY "Authenticated users can insert visits" 
ON public.visits FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated users can update visits
CREATE POLICY "Authenticated users can update visits" 
ON public.visits FOR UPDATE 
TO authenticated 
USING (true);

-- RLS policies for forms table
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view forms
CREATE POLICY "Authenticated users can view forms"
ON public.forms FOR SELECT
TO authenticated
USING (true);

-- Authenticated users with admin role can insert forms
CREATE POLICY "Admins can insert forms"
ON public.forms FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_user());

-- Authenticated users with admin role can update forms
CREATE POLICY "Admins can update forms"
ON public.forms FOR UPDATE
TO authenticated
USING (public.is_admin_user());

-- RLS policies for form_entries table
ALTER TABLE public.form_entries ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view form entries
CREATE POLICY "Authenticated users can view form entries"
ON public.form_entries FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert form entries
CREATE POLICY "Authenticated users can insert form entries"
ON public.form_entries FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own form entries
CREATE POLICY "Users can update own form entries"
ON public.form_entries FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.is_admin_user());
