# تنظیم ایمیل تأیید در Supabase

## ۱. آدرس Callback رو اضافه کن

در Supabase Dashboard:
- برو به **Authentication** → **URL Configuration**
- در **Site URL** آدرس سایتت رو بذار:
  ```
  https://your-site.vercel.app
  ```
- در **Redirect URLs** این رو اضافه کن:
  ```
  https://your-site.vercel.app/auth/callback
  ```
- دکمه **Save** رو بزن

## ۲. تنظیم قالب ایمیل

در Supabase Dashboard:
- برو به **Authentication** → **Email Templates**
- روی **Confirm signup** کلیک کن
- محتوای زیر رو جایگزین کن:

### Subject:
```
تأیید حساب NEXUS شما
```

### Body (HTML):
```html
<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif; max-width:500px; margin:0 auto; background:#05050A; color:#E8E8FF; border-radius:16px; overflow:hidden; border:1px solid rgba(0,255,180,0.2);">
  
  <div style="background:linear-gradient(135deg,rgba(0,255,180,0.1),rgba(0,207,255,0.1)); padding:32px; text-align:center; border-bottom:1px solid rgba(0,255,180,0.15);">
    <h1 style="color:#00FFB4; font-size:28px; margin:0; letter-spacing:3px;">⚡ NEXUS</h1>
  </div>

  <div style="padding:32px;">
    <h2 style="font-size:20px; margin:0 0 16px;">سلام! 👋</h2>
    <p style="color:#8888AA; line-height:1.8; margin:0 0 28px;">
      برای فعال‌سازی حساب NEXUS خود، روی دکمه زیر کلیک کنید:
    </p>
    
    <div style="text-align:center; margin:0 0 28px;">
      <a href="{{ .ConfirmationURL }}" 
         style="display:inline-block; padding:14px 36px; border-radius:10px; background:linear-gradient(135deg,#00FFB4,#00CFFF); color:#05050A; font-weight:800; font-size:16px; text-decoration:none;">
        ✅ تأیید حساب
      </a>
    </div>

    <p style="color:#4A4A7A; font-size:12px; line-height:1.7; margin:0;">
      اگر این ایمیل را شما درخواست نداده‌اید، آن را نادیده بگیرید.<br>
      این لینک تا ۲۴ ساعت معتبر است.
    </p>
  </div>

  <div style="background:rgba(0,255,180,0.03); padding:16px 32px; text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
    <p style="color:#4A4A7A; font-size:11px; margin:0;">© NEXUS Digital Platform</p>
  </div>

</div>
```

## ۳. تست کن

1. در سایت ثبت‌نام کن
2. ایمیل تأیید می‌رسه
3. روی دکمه "تأیید حساب" کلیک کن
4. به صفحه `/auth/callback` در سایتت هدایت می‌شی
5. بعد از چند ثانیه وارد حساب می‌شی و به خانه هدایت می‌شی

## ⚠️ نکته مهم

اگه روی localhost تست می‌کنی، در Redirect URLs اینو هم اضافه کن:
```
http://localhost:3000/auth/callback
```
