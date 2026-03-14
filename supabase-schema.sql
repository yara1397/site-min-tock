-- ══════════════════════════════════════════════════════════════
--  NEXUS — SUPABASE SCHEMA
--  مرحله ۱: این کل SQL رو در Supabase > SQL Editor اجرا کن
-- ══════════════════════════════════════════════════════════════

-- ساخت جدول profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID    REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT    NOT NULL,
  username    TEXT    UNIQUE NOT NULL,
  full_name   TEXT    NOT NULL DEFAULT '',
  phone       TEXT    DEFAULT '',
  address     TEXT    DEFAULT '',
  role        TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- فعال کردن RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سیاست‌های دسترسی
DROP POLICY IF EXISTS "select_own"   ON public.profiles;
DROP POLICY IF EXISTS "update_own"   ON public.profiles;
DROP POLICY IF EXISTS "insert_own"   ON public.profiles;
DROP POLICY IF EXISTS "admin_select" ON public.profiles;

CREATE POLICY "select_own"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "insert_own"   ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
);

-- تریگر updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- تریگر ساخت خودکار profile هنگام ثبت‌نام
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, phone, address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
