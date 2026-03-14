# ⚡ NEXUS — راهنمای کامل

## قدم ۱ — Supabase
1. برو supabase.com → SQL Editor → New Query
2. محتوای فایل supabase-schema.sql رو کپی و Run کن
3. برو Authentication → Users → Add User
   - Email: admin@nexus.ir
   - Password: YYYDDDDDDYYYadmin123
   - تیک Auto Confirm بزن
4. دوباره SQL Editor:
   UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@nexus.ir';

## قدم ۲ — نصب
در CMD داخل پوشه nexus-final:
   npm install

## قدم ۳ — تست محلی
   npm run dev
   برو http://localhost:3000

## قدم ۴ — Deploy روی Vercel
   npm install -g vercel
   vercel login
   vercel --prod

## اطلاعات ادمین
Email: admin@nexus.ir
Password: YYYDDDDDDYYYadmin123
