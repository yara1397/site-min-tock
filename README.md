# ⚡ NEXUS — راهنمای کامل راه‌اندازی

---

## 📌 قدم اول — Supabase رو آماده کن

### ۱. SQL Schema اجرا کن
- برو به: **supabase.com** → پروژه‌ات → **SQL Editor** → **New Query**
- محتوای فایل `supabase-schema.sql` رو کامل کپی کن و **Run** بزن
- باید بنویسه: `Success. No rows returned`

### ۲. کاربر ادمین بساز
- برو به: **Authentication** → **Users** → دکمه **Add User**
- Email: `admin@nexus.ir`
- Password: `YYYDDDDDDYYYadmin123`
- تیک **Auto Confirm User** رو بزن
- **Add User** رو بزن

### ۳. ادمین رو تنظیم کن
- دوباره برو به **SQL Editor** → **New Query**
- این رو اجرا کن:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@nexus.ir';
```
- باید بنویسه: `Success. 1 row affected`

### ۴. تأیید کن
```sql
SELECT email, role FROM public.profiles;
```
باید ببینی `admin@nexus.ir` با role = `admin`

---

## 📌 قدم دوم — پروژه رو روی Vercel بریز

### روش ۱ — GitHub (توصیه می‌شه)
```bash
# در پوشه پروژه:
git init
git add .
git commit -m "nexus init"
```
- در GitHub یه repo جدید بساز
- کد رو push کن
- برو **vercel.com** → **New Project** → repo رو import کن
- در **Environment Variables** اضافه کن:
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://tltgtjsyzhupfilsjrho.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Deploy** بزن

### روش ۲ — Vercel CLI
```bash
npm install
npm install -g vercel
vercel login
vercel --prod
```

---

## 📌 قدم سوم — تست کن

۱. آدرس سایت رو باز کن
۲. روی **ثبت‌نام** کلیک کن — یه حساب جدید بساز
۳. با `admin@nexus.ir` / `YYYDDDDDDYYYadmin123` لاگین کن
۴. صفحه **ادمین** رو ببین — لیست کاربران از Supabase میاد

---

## 📁 ساختار فایل‌ها

```
nexus-next/
├── pages/
│   ├── _app.js       ← session مدیریت
│   ├── index.js      ← صفحه خانه
│   ├── login.js      ← ورود واقعی
│   ├── register.js   ← ثبت‌نام واقعی (۷ فیلد)
│   ├── profile.js    ← پروفایل کاربر
│   ├── shop.js       ← فروشگاه
│   ├── news.js       ← مجله
│   ├── orders.js     ← سفارشات
│   └── admin.js      ← داشبورد ادمین
├── components/
│   └── UI.js         ← Cursor + Toast + Navbar
├── lib/
│   └── supabase.js   ← اتصال به Supabase
├── styles/
│   └── globals.css   ← طراحی Y2K Cyber
├── supabase-schema.sql  ← SQL دیتابیس
├── vercel.json
└── package.json
```

---

## 🔑 اطلاعات ادمین

| چیز | مقدار |
|-----|-------|
| ایمیل | `admin@nexus.ir` |
| پسورد | `YYYDDDDDDYYYadmin123` |
| نقش | `admin` |

