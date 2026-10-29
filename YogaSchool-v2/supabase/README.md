# The Yoga School: Supabase setup

The website reads classes, timetable, prices, shop products, events, blog posts and gift vouchers
from Supabase, and saves contact form messages there. Staff edit everything at **/admin**.
Bookings and payments stay on Momence: "Book" and "Buy" buttons link there.

Until Supabase is connected, every page shows its built-in content, so nothing breaks.

## 1. Create the database

1. Open your project at <https://supabase.com/dashboard>.
2. Go to **SQL Editor**, then **New query**. Paste all of `schema.sql` and click **Run**.
3. Fill the tables with the website's current content. Easiest: sign in to `/admin` and click **Import** on the Dashboard (it fills every empty section, including the timetable, events and shop products from Momence, and never touches sections that already have content). Alternatively paste all of `seed.sql` into a new query and click **Run**.
   This loads the current classes, prices, blog posts, shop items, gift vouchers and timetable.

## 2. Connect the website

1. In Supabase go to **Project Settings**, then **API**.
2. Copy the **Project URL** and the **anon public** key into `assets/js/supabase-config.js`:

   ```js
   window.TYS_SUPABASE = {
     url: 'https://YOUR-PROJECT.supabase.co',
     anonKey: 'eyJ...'
   };
   ```

   The anon key is safe to publish; Row Level Security protects the data.
   **Never** paste the `service_role` key into any website file.

## 3. Create staff logins

1. In Supabase go to **Authentication**, then **Users**, then **Add user**, then **Create new user**.
   Enter the staff member's email and a password, and tick **Auto Confirm User**.
2. Recommended: go to **Authentication**, then **Sign In / Providers**, and turn **off**
   "Allow new users to sign up", so only the accounts you create can exist.

## 4. Give a login admin access

In the **SQL Editor**, run this with the staff member's email:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'staff@example.com';
```

They can now sign in at `https://theyogaschool.com.au/admin/`.

To remove access: `delete from public.admins where email = 'staff@example.com';`

## 5. Review before publishing

Two parts of the starting content are loaded **hidden**, because they need checking:

- **Gift vouchers.** The prices came from the old gift voucher page ($30 per class),
  which doesn't match the current drop-in price ($35). Fix them in **/admin**, then **Gift vouchers**,
  and tick *Published*.
- **Timetable.** It was imported from one week of the Momence timetable and converted to Cairns time.
  Check each class in **/admin**, then **Timetable**, clear the note "Imported from Momence: please check",
  and tick *Published*. Until at least one class is published, the Timetable page shows
  only the Momence booking widget, as it does today.

## 6. Password reset links (optional)

For "Forgot password?" on the admin sign-in page, add your site to
**Authentication**, then **URL Configuration**, then **Redirect URLs**: `https://theyogaschool.com.au/admin/`

## What lives where

| Website page | Table | Notes |
|---|---|---|
| /pages/classes | `classes` | Sort order, photo, badge, full description |
| /pages/timetable | `timetable` | Weekly classes by day; Momence widget stays below for booking |
| /pages/prices | `prices` | `membership` rows become cards; other types become the passes list |
| /pages/shop | `shop_products` | Empty price shows "Enquire in studio" |
| /pages/events | `events` | Upcoming events only; they disappear after they finish |
| /pages/blog1, /pages/post?slug=… | `blog_posts` | A future publish date keeps an article hidden until then |
| /gift-vouchers | `gift_vouchers` | Buy buttons go to Momence |
| /pages/contact-us | `contact_messages` | Admins read and reply in /admin, then Messages |

Images uploaded in /admin are stored in the public **media** storage bucket.
