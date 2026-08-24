# PRD.md
# Voucher Management System

Versi: 1.0.0
Status: Planning
Tanggal: 24 Agustus 2026
Platform: Web
Target pengguna: Admin dan penerima voucher

## 1. Ringkasan Produk

Voucher Management System adalah aplikasi web pribadi untuk membuat, mengelola, mengirim, dan mengklaim voucher secara digital.

Sistem ini tidak menggunakan payment gateway.

Admin membuat voucher, menentukan isi voucher, memilih atau membuat desain template, lalu menghasilkan link khusus. Admin mengirim link tersebut kepada penerima melalui WhatsApp, Telegram, Discord, atau media lain.

Penerima membuka link voucher dan dapat melihat detail voucher. Jika voucher masih valid, penerima dapat melakukan klaim.

Admin dapat mengelola seluruh lifecycle voucher mulai dari pembuatan, distribusi, klaim, pembatalan, sampai penggunaan voucher.

Sistem juga menyediakan voucher template editor agar admin dapat membuat desain voucher sendiri.

Contoh penggunaan:

Admin membuat voucher:

"Voucher Ngopi Gratis"
Nilai: Rp50.000
Penerima: Bondan
Berlaku: 24 Agustus 2026 sampai 30 September 2026

Sistem menghasilkan:

https://domain.com/v/8fK92LmX

Admin mengirim link tersebut kepada Bondan.

Bondan membuka link dan melihat voucher.

Bondan melakukan klaim.

Status voucher berubah menjadi CLAIMED.

Admin dapat melihat bahwa voucher sudah diklaim.


## 2. Tujuan Produk

Tujuan utama:

1. Mempermudah admin membuat voucher digital.
2. Mempermudah admin membagikan voucher menggunakan link.
3. Memungkinkan penerima melakukan klaim tanpa membuat akun.
4. Memungkinkan admin mengelola voucher secara penuh.
5. Menyediakan sistem template desain voucher.
6. Menyediakan dashboard untuk memantau voucher.
7. Mencegah voucher diklaim lebih dari satu kali.
8. Menyediakan riwayat aktivitas voucher.
9. Menjaga keamanan link voucher.
10. Membuat sistem sederhana yang cocok untuk penggunaan pribadi.


## 3. Non-Goals

Versi pertama tidak menyediakan:

1. Payment gateway.
2. Checkout.
3. Saldo digital.
4. Transfer uang.
5. Marketplace.
6. Sistem membership publik.
7. Loyalty point.
8. Integrasi WhatsApp API otomatis.
9. Integrasi email marketing.
10. Multi-tenant SaaS.
11. Sistem pembayaran voucher.
12. Refund.


## 4. Target Pengguna

### 4.1 Admin

Admin adalah pemilik sistem.

Admin dapat:

- Login.
- Membuat voucher.
- Mengedit voucher.
- Menghapus voucher.
- Membatalkan voucher.
- Membuat template.
- Mengedit template.
- Menghapus template.
- Melihat daftar voucher.
- Melihat detail voucher.
- Membuat link voucher.
- Meng-copy link voucher.
- Melihat status voucher.
- Melihat riwayat klaim.
- Melakukan revoke voucher.
- Menandai voucher sebagai digunakan.
- Melihat statistik.

### 4.2 Recipient

Recipient adalah orang yang menerima voucher.

Recipient tidak wajib memiliki akun.

Recipient cukup mendapatkan link voucher.

Contoh:

https://domain.com/v/AbC123xYz


## 5. Konsep Utama

Sistem memiliki empat entity utama:

Admin
Voucher
Voucher Template
Voucher Claim

Relasinya:

Admin
↓
Voucher
↓
Voucher Template

Voucher
↓
Voucher Claim

Admin membuat Voucher.

Voucher menggunakan Voucher Template.

Recipient melakukan Claim terhadap Voucher.


## 6. Voucher Lifecycle

Status voucher:

DRAFT
ACTIVE
CLAIMED
REDEEMED
EXPIRED
CANCELLED

Flow:

DRAFT
↓
ACTIVE
↓
CLAIMED
↓
REDEEMED

Alternative:

ACTIVE
↓
EXPIRED

ACTIVE
↓
CANCELLED

CLAIMED
↓
CANCELLED

Aturan:

DRAFT:
Voucher belum bisa diklaim.

ACTIVE:
Voucher dapat dibuka dan diklaim.

CLAIMED:
Voucher sudah diklaim oleh recipient.

REDEEMED:
Voucher sudah digunakan.

EXPIRED:
Tanggal berlaku sudah lewat.

CANCELLED:
Admin membatalkan voucher.


## 7. Fitur Admin

### 7.1 Admin Authentication

Admin harus login sebelum mengakses dashboard.

Fitur:

- Login.
- Logout.
- Session management.
- Password hashing.
- Protected dashboard.
- Rate limiting login.
- CSRF protection melalui mekanisme framework.
- Session expiration.

Versi awal hanya membutuhkan satu role:

ADMIN


### 7.2 Dashboard

Dashboard menampilkan:

- Total voucher.
- Voucher aktif.
- Voucher sudah diklaim.
- Voucher sudah digunakan.
- Voucher expired.
- Voucher dibatalkan.
- Total template.
- Claim terbaru.

Contoh:

Total Voucher
125

Aktif
43

Claimed
31

Redeemed
42

Expired
7

Cancelled
2


### 7.3 Voucher Management

Admin dapat membuat voucher.

Form:

- Judul voucher.
- Deskripsi.
- Nama penerima.
- Email penerima optional.
- Nomor telepon optional.
- Nilai voucher.
- Satuan nilai.
- Template.
- Kode voucher.
- Masa berlaku mulai.
- Masa berlaku selesai.
- Maksimal claim.
- Catatan admin.
- Status.

Contoh:

Judul:
Voucher Makan Gratis

Recipient:
Bondan

Value:
100000

Unit:
IDR

Start:
2026-08-24

End:
2026-09-30

Max Claim:
1


### 7.4 Voucher Detail

Admin dapat melihat:

- ID voucher.
- Judul.
- Recipient.
- Value.
- Status.
- Template.
- Created date.
- Expiry date.
- Claim date.
- Redeemed date.
- Claim IP.
- Claim user agent.
- Link voucher.
- Voucher code.
- Activity log.


### 7.5 Generate Voucher Link

Setiap voucher memiliki public token.

Contoh:

/v/4sJ82kLm91

Token harus dibuat menggunakan cryptographically secure random generator.

Jangan menggunakan:

/v/1
/v/2
/v/3

Karena mudah ditebak.

Admin mendapatkan tombol:

Copy Link

Contoh:

https://voucher.domain.com/v/4sJ82kLm91


### 7.6 Revoke Voucher

Admin dapat membatalkan voucher.

Flow:

Admin klik Cancel Voucher.

Sistem menampilkan confirmation.

Admin mengonfirmasi.

Status:

ACTIVE → CANCELLED

Voucher tidak dapat diklaim setelah dibatalkan.


### 7.7 Mark as Redeemed

Admin dapat menandai voucher sebagai sudah digunakan.

Flow:

Voucher CLAIMED

Admin membuka detail.

Klik:

Mark as Redeemed

Status:

CLAIMED → REDEEMED

Simpan:

redeemed_at

redeemed_by


## 8. Recipient Flow

Recipient tidak perlu login.

Flow:

1. Recipient menerima link.
2. Recipient membuka link.
3. Sistem memvalidasi token.
4. Sistem menampilkan voucher.
5. Recipient melihat detail.
6. Recipient klik Claim Voucher.
7. Sistem meminta nama recipient jika belum ditentukan.
8. Sistem melakukan validasi.
9. Sistem menyimpan claim.
10. Voucher berubah menjadi CLAIMED.
11. Sistem menampilkan voucher yang sudah diklaim.


## 9. Public Voucher Page

URL:

/v/[token]

Contoh:

/v/4sJ82kLm91

Halaman menampilkan:

- Voucher design.
- Judul.
- Nama recipient.
- Nilai voucher.
- Deskripsi.
- Masa berlaku.
- Voucher code.
- Status.
- Tombol Claim.
- Informasi penggunaan.

Jika ACTIVE:

Tampilkan:

Claim Voucher

Jika CLAIMED:

Tampilkan:

Voucher sudah diklaim.

Jika REDEEMED:

Tampilkan:

Voucher sudah digunakan.

Jika EXPIRED:

Tampilkan:

Voucher sudah expired.

Jika CANCELLED:

Tampilkan:

Voucher sudah dibatalkan.


## 10. Claim Mechanism

Claim harus atomic.

Masalah yang harus dicegah:

Dua browser membuka voucher yang sama pada waktu bersamaan.

Keduanya menekan Claim.

Sistem harus memastikan hanya satu request yang berhasil.

Gunakan database transaction.

Pseudo-flow:

BEGIN TRANSACTION

SELECT voucher FOR UPDATE

Check status

Check expiry

Check max claim

Create claim

Update voucher status

COMMIT

Jika voucher sudah CLAIMED:

return error.


## 11. Recipient Identification

Versi pertama tidak membutuhkan akun recipient.

Saat claim, sistem dapat meminta:

- Nama.
- Email optional.
- Nomor WhatsApp optional.

Contoh:

Nama:
Bondan Banuaji

WhatsApp:
08xxxxxxxxxx

Email:
bondan@example.com

Data ini tersimpan di claim.

Admin dapat melihat informasi tersebut.


## 12. Voucher Template System

Template digunakan untuk menentukan tampilan voucher.

Contoh template:

1. Birthday.
2. Coffee.
3. Food.
4. Gaming.
5. Gift.
6. Event.
7. Custom.

Template memiliki:

- Nama.
- Description.
- Thumbnail.
- Background.
- Text elements.
- Image elements.
- Shape elements.
- QR element optional.
- Barcode element optional.
- Layout.
- Width.
- Height.
- Configuration JSON.


## 13. Voucher Design Editor

Admin dapat membuat template menggunakan visual editor.

Konsep:

Canvas editor
+
Toolbar
+
Properties panel

Layout:

┌─────────────────────────────────────┐
│ Toolbar                             │
├──────────┬────────────────┬─────────┤
│ Elements │    Canvas      │ Props   │
│          │                │         │
│ Text     │    Voucher     │ Color   │
│ Image    │    Preview     │ Size    │
│ Shape    │                │ Font    │
│ QR       │                │ Position│
│ Barcode  │                │         │
└──────────┴────────────────┴─────────┘


## 14. Design Editor Elements

### Text

Properties:

- Content.
- Font.
- Font size.
- Font weight.
- Color.
- Alignment.
- Position.
- Rotation.
- Opacity.

Text dapat menggunakan variable.

Contoh:

{{recipient_name}}

{{voucher_title}}

{{voucher_value}}

{{voucher_code}}

{{expiry_date}}


### Image

Properties:

- Source.
- Width.
- Height.
- Position.
- Rotation.
- Border radius.
- Opacity.

### Shape

Support:

- Rectangle.
- Circle.
- Rounded rectangle.
- Line.

### QR Code

QR dapat berisi:

Voucher URL.

Contoh:

https://domain.com/v/4sJ82kLm91

### Barcode

Barcode dapat menggunakan:

Voucher code.


## 15. Template Variable System

Template harus mendukung dynamic data.

Variables:

{{voucher_title}}

{{voucher_description}}

{{recipient_name}}

{{recipient_email}}

{{voucher_value}}

{{voucher_code}}

{{voucher_token}}

{{start_date}}

{{expiry_date}}

{{claim_date}}

{{redeemed_date}}

{{status}}


Saat voucher ditampilkan:

{{recipient_name}}

akan berubah menjadi:

Bondan Banuaji


## 16. Template Versioning

Template yang sudah digunakan oleh voucher tidak boleh rusak ketika admin mengedit template.

Gunakan versioning.

Contoh:

Template Coffee
v1
v2
v3

Voucher lama tetap menggunakan snapshot template yang digunakan saat voucher dibuat.

Voucher baru menggunakan template terbaru.


## 17. Voucher Code

Selain public token, voucher memiliki kode voucher.

Contoh:

COFFEE-7K2P

atau:

BDN-2026-X8K2

Public token digunakan untuk mengakses halaman.

Voucher code digunakan untuk validasi penggunaan voucher.

Keduanya harus berbeda.


## 18. QR Code

Public voucher dapat menampilkan QR Code.

QR berisi URL voucher.

Contoh:

https://domain.com/v/4sJ82kLm91

Admin dapat memilih apakah QR ditampilkan pada template.


## 19. Admin Voucher Table

Kolom:

- Voucher.
- Recipient.
- Value.
- Status.
- Start Date.
- Expiry.
- Claimed.
- Redeemed.
- Created.

Filter:

- Status.
- Date.
- Template.

Search:

- Voucher title.
- Recipient.
- Voucher code.


## 20. Activity Log

Sistem menyimpan aktivitas penting.

Event:

ADMIN_LOGIN

VOUCHER_CREATED

VOUCHER_UPDATED

VOUCHER_CANCELLED

VOUCHER_CLAIMED

VOUCHER_REDEEMED

VOUCHER_EXPIRED

TEMPLATE_CREATED

TEMPLATE_UPDATED

TEMPLATE_DELETED

Contoh:

2026-08-24 13:30
VOUCHER_CLAIMED
Voucher: Coffee Gratis
Recipient: Bondan


## 21. Database Schema

Database menggunakan PostgreSQL.

### admins

id
email
password_hash
name
created_at
updated_at


### vouchers

id
title
description
recipient_name
recipient_email
recipient_phone
value
currency
voucher_code
public_token
template_id
template_snapshot
status
starts_at
expires_at
claimed_at
redeemed_at
created_at
updated_at


### voucher_claims

id
voucher_id
recipient_name
recipient_email
recipient_phone
ip_address
user_agent
claimed_at


### voucher_templates

id
name
description
thumbnail_url
width
height
design_json
is_active
created_at
updated_at


### template_versions

id
template_id
version
design_json
created_at


### media

id
file_name
file_url
mime_type
file_size
created_at


### activity_logs

id
actor_type
actor_id
action
entity_type
entity_id
metadata
ip_address
user_agent
created_at


## 22. Database Relations

admins

1 → N

activity_logs


voucher_templates

1 → N

template_versions


voucher_templates

1 → N

vouchers


vouchers

1 → N

voucher_claims


vouchers

1 → N

activity_logs


## 23. Recommended Tech Stack

Frontend:

Next.js
React
TypeScript

UI:

Tailwind CSS
shadcn/ui
Lucide React

Backend:

Next.js App Router
Server Actions
Route Handlers

Database:

PostgreSQL

ORM:

Prisma

Authentication:

Auth.js

Validation:

Zod

Form:

React Hook Form

Design Editor:

Fabric.js

QR:

qrcode

Image processing:

Sharp

Storage:

Supabase Storage atau Cloudflare R2

Deployment:

Vercel

Database:

Supabase PostgreSQL atau Neon


## 24. Recommended Architecture

Gunakan monolith.

Tidak perlu microservices.

Struktur:

Browser
↓
Next.js
├── Public Voucher
├── Admin Dashboard
├── API / Server Actions
├── Authentication
├── Voucher Service
├── Template Service
└── Claim Service
        ↓
     Prisma
        ↓
   PostgreSQL

Storage:

Next.js
↓
Object Storage


## 25. Kenapa Stack Ini

Next.js:

- Cocok untuk frontend dan backend.
- Routing sudah tersedia.
- Server Actions cocok untuk CRUD.
- Deployment mudah.
- Cocok untuk project personal.

TypeScript:

- Mengurangi error data.
- Cocok untuk project yang memiliki banyak entity.

PostgreSQL:

- Relational database.
- Cocok untuk voucher dan claim.
- Transaction support kuat.

Prisma:

- Type-safe database access.
- Migration mudah.
- Cocok untuk TypeScript.

Tailwind + shadcn/ui:

- Cepat membuat dashboard.
- Komponen mudah dikustomisasi.

Fabric.js:

- Cocok untuk canvas editor.
- Mendukung text, image, shape, position, rotation.
- Design dapat disimpan sebagai JSON.

Supabase Storage atau Cloudflare R2:

- Menyimpan gambar template.
- Tidak perlu menyimpan file langsung di database.


## 26. Struktur Folder

src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── vouchers/
│   │   ├── templates/
│   │   ├── claims/
│   │   └── activity/
│   │
│   ├── v/
│   │   └── [token]/
│   │
│   ├── api/
│   │   ├── vouchers/
│   │   ├── claims/
│   │   └── templates/
│   │
│   └── layout.tsx
│
├── components/
│   ├── admin/
│   ├── voucher/
│   ├── template-editor/
│   └── ui/
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── voucher.ts
│   ├── claim.ts
│   ├── template.ts
│   ├── storage.ts
│   ├── qr.ts
│   └── validation.ts
│
├── server/
│   ├── actions/
│   ├── services/
│   └── repositories/
│
├── types/
│
└── styles/


## 27. API Design

### Admin

POST /api/admin/vouchers

Membuat voucher.


GET /api/admin/vouchers

Mengambil daftar voucher.


GET /api/admin/vouchers/:id

Mengambil detail voucher.


PATCH /api/admin/vouchers/:id

Mengubah voucher.


DELETE /api/admin/vouchers/:id

Menghapus voucher.


POST /api/admin/vouchers/:id/cancel

Membatalkan voucher.


POST /api/admin/vouchers/:id/redeem

Menandai voucher digunakan.


### Public

GET /api/vouchers/:token

Mengambil public voucher.


POST /api/vouchers/:token/claim

Melakukan claim.


### Templates

GET /api/admin/templates

POST /api/admin/templates

GET /api/admin/templates/:id

PATCH /api/admin/templates/:id

DELETE /api/admin/templates/:id


## 28. Claim API Validation

Request:

POST /api/vouchers/:token/claim

Body:

{
  "recipientName": "Bondan Banuaji",
  "recipientEmail": "bondan@example.com",
  "recipientPhone": "08xxxxxxxxxx"
}

Server:

1. Validate token.
2. Find voucher.
3. Check status.
4. Check start date.
5. Check expiry.
6. Check claim limit.
7. Lock voucher.
8. Create claim.
9. Update voucher.
10. Create activity log.
11. Return result.


## 29. Security

Public token harus random.

Gunakan:

crypto.randomBytes()

atau UUID yang aman.

Jangan expose database ID pada public URL.

Gunakan:

/v/Ab8kL92xP

bukan:

/v/123


Password admin harus menggunakan hashing.

Gunakan Argon2 atau bcrypt.

Tambahkan rate limiting pada:

- Login.
- Voucher lookup.
- Claim.

Claim harus menggunakan database transaction.

Validasi seluruh input menggunakan Zod.

Admin route harus protected.

Jangan mempercayai data dari client.

Status voucher harus ditentukan server.

Client tidak boleh mengirim:

status: CLAIMED

dan membuat server menerimanya.


## 30. Anti Double Claim

Database harus memiliki constraint yang sesuai.

Untuk satu voucher:

voucher_id UNIQUE

pada claim aktif atau gunakan pengecekan transaction.

Recommended:

voucher_claims.voucher_id UNIQUE

Jika satu voucher hanya boleh diklaim sekali.


## 31. Expiration Handling

Tidak perlu cron untuk versi awal.

Saat voucher diakses:

Jika:

expires_at < current_time

dan status ACTIVE

ubah menjadi:

EXPIRED

Dengan begitu sistem tetap akurat walaupun tidak ada background worker.

Untuk versi berikutnya dapat menggunakan scheduled job.


## 32. Admin UI

Sidebar:

Dashboard
Vouchers
Templates
Claims
Activity Logs
Settings

Header:

Search
Notification
Admin Profile


## 33. Dashboard UI

Card:

Total Voucher

Active Voucher

Claimed Voucher

Redeemed Voucher

Expired Voucher

Cancelled Voucher


Chart:

Voucher Created

Voucher Claimed

Voucher Redeemed


Table:

Recent Activity


## 34. Voucher Creation UI

Step 1:

Basic Information

Step 2:

Recipient

Step 3:

Template

Step 4:

Voucher Settings

Step 5:

Preview

Step 6:

Create Voucher


Fields:

Title
Description
Recipient
Value
Currency
Start Date
Expiry Date
Template
Voucher Code


Setelah selesai:

Voucher dibuat.

Public URL ditampilkan.

Button:

Copy Link

Open Voucher


## 35. Template Management UI

Page:

/admin/templates

Tampilan:

Template Card
Template Card
Template Card

Setiap card:

Preview
Name
Version
Updated
Actions


Actions:

Edit
Duplicate
Delete


## 36. Template Editor UI

Route:

/admin/templates/new

atau:

/admin/templates/:id/edit


Toolbar:

Select
Text
Image
Shape
QR
Barcode
Delete
Undo
Redo
Zoom
Preview
Save


Panel kiri:

Elements


Canvas:

Voucher


Panel kanan:

Properties


## 37. Template JSON

Contoh sederhana:

{
  "version": 1,
  "width": 1200,
  "height": 700,
  "background": "#111827",
  "objects": [
    {
      "type": "text",
      "text": "{{voucher_title}}",
      "left": 100,
      "top": 100,
      "fontSize": 48
    },
    {
      "type": "text",
      "text": "{{recipient_name}}",
      "left": 100,
      "top": 180,
      "fontSize": 32
    }
  ]
}


## 38. Voucher Rendering

Template JSON harus dirender menggunakan data voucher.

Input:

Template JSON

+

Voucher Data

Output:

Voucher UI.


Contoh:

{{voucher_title}}

menjadi:

Voucher Ngopi Gratis


{{voucher_value}}

menjadi:

Rp50.000


{{recipient_name}}

menjadi:

Bondan Banuaji


## 39. Voucher Download

Versi MVP:

Tidak wajib menyediakan PDF.

Voucher dapat ditampilkan sebagai halaman web.

Versi berikutnya:

Download PNG.

Download PDF.

Print Voucher.


## 40. Responsive Design

Public voucher harus mendukung:

Desktop
Tablet
Mobile

Target utama:

Mobile.

Admin dashboard:

Desktop first.

Tetap responsive untuk tablet.


## 41. Error State

404:

Voucher tidak ditemukan.

410:

Voucher sudah tidak tersedia.

Expired:

Voucher sudah expired.

Cancelled:

Voucher sudah dibatalkan.

Claimed:

Voucher sudah diklaim.

500:

Terjadi kesalahan server.


## 42. Empty State

Tidak ada voucher:

"Belum ada voucher."

Tidak ada template:

"Belum ada template. Buat template pertama Anda."


## 43. MVP Scope

MVP wajib memiliki:

Authentication admin.

Dashboard.

Voucher CRUD.

Voucher token.

Public voucher page.

Claim voucher.

Voucher status.

Voucher expiry.

Voucher cancellation.

Redeem voucher.

Template CRUD.

Basic template editor.

Dynamic variables.

QR Code.

Activity log.

Responsive public page.

Database transaction.


## 44. Phase 2

Setelah MVP stabil:

PDF export.

PNG export.

Advanced editor.

Drag and drop.

Template duplication.

Template versioning.

Bulk voucher creation.

CSV import.

Voucher analytics.

Advanced search.

Advanced filtering.

Custom QR content.

Barcode.

Scheduled expiration.

Notification.


## 45. Phase 3

Fitur tambahan:

WhatsApp share.

Telegram share.

Email delivery.

Custom domain.

Multiple admin.

Role permission.

Audit dashboard.

Voucher batch.

Voucher campaign.

Reusable recipient.

Voucher analytics.


## 46. User Stories

### Admin

Sebagai admin, saya ingin login agar dashboard hanya dapat diakses saya.

Sebagai admin, saya ingin membuat voucher agar dapat memberikan hadiah kepada teman.

Sebagai admin, saya ingin menentukan recipient agar voucher memiliki penerima tertentu.

Sebagai admin, saya ingin membuat link voucher agar mudah dikirim.

Sebagai admin, saya ingin melihat status voucher agar tahu apakah voucher sudah digunakan.

Sebagai admin, saya ingin membatalkan voucher agar voucher tidak dapat digunakan.

Sebagai admin, saya ingin membuat template agar desain voucher sesuai kebutuhan.

Sebagai admin, saya ingin mengedit template menggunakan visual editor agar tidak perlu menulis kode.

Sebagai admin, saya ingin melihat activity log agar dapat mengetahui perubahan voucher.


### Recipient

Sebagai recipient, saya ingin membuka link voucher tanpa login.

Sebagai recipient, saya ingin melihat detail voucher.

Sebagai recipient, saya ingin melakukan claim.

Sebagai recipient, saya ingin mengetahui status voucher.


## 47. Acceptance Criteria

### Create Voucher

Admin dapat membuat voucher.

Voucher memiliki public token.

Public token unik.

Voucher tersimpan di database.

Public URL dapat dibuka.


### Claim Voucher

Recipient dapat claim voucher ACTIVE.

Voucher berubah menjadi CLAIMED.

Claim tersimpan.

Claim hanya dapat dilakukan sekali.

Request bersamaan tidak boleh menghasilkan dua claim.


### Expired Voucher

Voucher yang melewati expires_at tidak dapat diklaim.

Status berubah menjadi EXPIRED.


### Cancelled Voucher

Voucher CANCELLED tidak dapat diklaim.


### Redeemed Voucher

Voucher REDEEMED tidak dapat diklaim kembali.


### Template

Admin dapat membuat template.

Admin dapat menambahkan text.

Admin dapat mengubah text.

Admin dapat menambahkan image.

Admin dapat menambahkan shape.

Admin dapat menambahkan QR.

Admin dapat menyimpan template.

Template dapat digunakan oleh voucher.


## 48. Development Planning

Development dibagi menjadi beberapa sprint.


### Sprint 0. Project Setup

Task:

- [ ] Buat repository.
- [ ] Buat project Next.js.
- [ ] Aktifkan TypeScript.
- [ ] Setup Tailwind.
- [ ] Setup shadcn/ui.
- [ ] Setup ESLint.
- [ ] Setup Prettier.
- [ ] Setup environment variables.
- [ ] Setup Prisma.
- [ ] Setup PostgreSQL.
- [ ] Buat database connection.
- [ ] Buat initial migration.
- [ ] Setup Git.
- [ ] Buat README.
- [ ] Buat `.env.example`.


### Sprint 1. Authentication

Task:

- [ ] Setup Auth.js.
- [ ] Buat admin model.
- [ ] Buat login page.
- [ ] Buat logout.
- [ ] Buat session handling.
- [ ] Protect `/admin`.
- [ ] Protect admin API.
- [ ] Implement password hashing.
- [ ] Implement login rate limit.


### Sprint 2. Database

Task:

- [ ] Buat schema voucher.
- [ ] Buat schema claim.
- [ ] Buat schema template.
- [ ] Buat schema template version.
- [ ] Buat schema media.
- [ ] Buat schema activity log.
- [ ] Buat relation.
- [ ] Buat indexes.
- [ ] Buat unique constraints.
- [ ] Migration.
- [ ] Seed admin.


### Sprint 3. Voucher Backend

Task:

- [ ] Voucher service.
- [ ] Create voucher.
- [ ] Read voucher.
- [ ] Update voucher.
- [ ] Delete voucher.
- [ ] Cancel voucher.
- [ ] Redeem voucher.
- [ ] Generate secure token.
- [ ] Generate voucher code.
- [ ] Validate expiry.
- [ ] Implement status transition.
- [ ] Implement activity log.


### Sprint 4. Admin Voucher UI

Task:

- [ ] Dashboard layout.
- [ ] Sidebar.
- [ ] Header.
- [ ] Voucher list.
- [ ] Search.
- [ ] Filter.
- [ ] Pagination.
- [ ] Create voucher form.
- [ ] Edit voucher form.
- [ ] Voucher detail.
- [ ] Cancel confirmation.
- [ ] Redeem confirmation.
- [ ] Copy voucher URL.


### Sprint 5. Public Voucher

Task:

- [ ] Create `/v/[token]`.
- [ ] Validate token.
- [ ] Render voucher.
- [ ] Display status.
- [ ] Display expiry.
- [ ] Claim button.
- [ ] Claim form.
- [ ] Success state.
- [ ] Error state.
- [ ] Expired state.
- [ ] Cancelled state.
- [ ] Claimed state.


### Sprint 6. Claim System

Task:

- [ ] Claim endpoint.
- [ ] Zod validation.
- [ ] Database transaction.
- [ ] Row locking strategy.
- [ ] Duplicate claim prevention.
- [ ] IP logging.
- [ ] User agent logging.
- [ ] Activity log.
- [ ] Rate limit.
- [ ] Test concurrent requests.


### Sprint 7. Template System

Task:

- [ ] Template CRUD.
- [ ] Template list.
- [ ] Template preview.
- [ ] Template creation.
- [ ] Template edit.
- [ ] Template delete.
- [ ] Template duplicate.
- [ ] Template version.
- [ ] Template JSON storage.


### Sprint 8. Template Editor

Task:

- [ ] Install Fabric.js.
- [ ] Create canvas.
- [ ] Text tool.
- [ ] Image tool.
- [ ] Shape tool.
- [ ] QR tool.
- [ ] Barcode tool.
- [ ] Object selection.
- [ ] Drag.
- [ ] Resize.
- [ ] Rotate.
- [ ] Delete.
- [ ] Undo.
- [ ] Redo.
- [ ] Zoom.
- [ ] Properties panel.
- [ ] Variable insertion.
- [ ] Save JSON.
- [ ] Preview.


### Sprint 9. Dynamic Voucher Rendering

Task:

- [ ] Build variable parser.
- [ ] Replace recipient variables.
- [ ] Replace title.
- [ ] Replace description.
- [ ] Replace value.
- [ ] Replace voucher code.
- [ ] Replace dates.
- [ ] Replace status.
- [ ] Render QR.
- [ ] Test template compatibility.


### Sprint 10. Activity & Analytics

Task:

- [ ] Activity log page.
- [ ] Activity filtering.
- [ ] Activity search.
- [ ] Voucher statistics.
- [ ] Claim statistics.
- [ ] Redeemed statistics.
- [ ] Dashboard charts.


### Sprint 11. Security

Task:

- [ ] Rate limiting.
- [ ] Input validation.
- [ ] Authorization.
- [ ] Secure token generation.
- [ ] SQL injection testing.
- [ ] XSS testing.
- [ ] CSRF testing.
- [ ] File upload validation.
- [ ] File size validation.
- [ ] MIME validation.
- [ ] Security headers.
- [ ] Admin session testing.


### Sprint 12. Testing

Unit tests:

- [ ] Token generation.
- [ ] Voucher status.
- [ ] Expiration.
- [ ] Claim validation.
- [ ] Template variable replacement.

Integration tests:

- [ ] Create voucher.
- [ ] Update voucher.
- [ ] Cancel voucher.
- [ ] Claim voucher.
- [ ] Redeem voucher.
- [ ] Template CRUD.

E2E:

- [ ] Admin login.
- [ ] Create voucher.
- [ ] Copy voucher link.
- [ ] Open public voucher.
- [ ] Claim voucher.
- [ ] Verify dashboard.
- [ ] Redeem voucher.
- [ ] Verify status.


## 49. Testing Scenario

Scenario 1:

Admin membuat voucher.

Expected:

Voucher ACTIVE.

Scenario 2:

Recipient membuka link.

Expected:

Voucher muncul.

Scenario 3:

Recipient claim.

Expected:

Voucher CLAIMED.

Scenario 4:

Recipient membuka link lagi.

Expected:

Voucher sudah diklaim.

Scenario 5:

Admin redeem voucher.

Expected:

Voucher REDEEMED.

Scenario 6:

Recipient mencoba claim lagi.

Expected:

Claim ditolak.

Scenario 7:

Voucher expired.

Expected:

Claim ditolak.

Scenario 8:

Admin cancel voucher.

Expected:

Claim ditolak.

Scenario 9:

Dua browser claim bersamaan.

Expected:

Hanya satu claim berhasil.


## 50. Environment Variables

Contoh:

DATABASE_URL=

AUTH_SECRET=

NEXT_PUBLIC_APP_URL=

STORAGE_ENDPOINT=

STORAGE_ACCESS_KEY=

STORAGE_SECRET_KEY=

STORAGE_BUCKET=

RATE_LIMIT_REDIS_URL=


Redis optional untuk MVP.

Jika traffic kecil, rate limit dapat menggunakan provider atau mekanisme sederhana terlebih dahulu.


## 51. Deployment

Recommended:

Frontend + Backend:

Vercel

Database:

Supabase PostgreSQL atau Neon

Storage:

Supabase Storage atau Cloudflare R2

Domain:

voucher.domainanda.com


Production flow:

GitHub
↓
Vercel
↓
Next.js
↓
PostgreSQL
↓
Storage


## 52. Git Workflow

Branch:

main
develop
feature/*
fix/*

Contoh:

feature/auth

feature/voucher-crud

feature/voucher-claim

feature/template-editor

feature/activity-log


Commit:

feat: add voucher creation

feat: add voucher claim

feat: add template editor

fix: prevent duplicate voucher claim

fix: validate expired voucher


## 53. Definition of Done

Feature dianggap selesai jika:

- [ ] UI selesai.
- [ ] Backend selesai.
- [ ] Database selesai.
- [ ] Validation selesai.
- [ ] Error handling selesai.
- [ ] Authorization selesai.
- [ ] Responsive.
- [ ] Tested.
- [ ] Tidak ada TypeScript error.
- [ ] Tidak ada lint error.
- [ ] Migration berhasil.
- [ ] Build production berhasil.


## 54. MVP Development Order

Urutan implementasi yang disarankan:

1. Project setup.
2. Database.
3. Authentication.
4. Voucher CRUD.
5. Public voucher.
6. Claim system.
7. Redeem system.
8. Activity log.
9. Template CRUD.
10. Template editor.
11. Dynamic variables.
12. QR code.
13. Dashboard analytics.
14. Security hardening.
15. Testing.
16. Deployment.


## 55. Prioritas Fitur

P0. Wajib MVP:

- Admin login.
- Voucher CRUD.
- Voucher link.
- Public voucher.
- Claim.
- Status voucher.
- Expiration.
- Cancel.
- Redeem.
- Database transaction.

P1. Penting:

- Template CRUD.
- Template editor.
- Dynamic variables.
- QR code.
- Activity log.
- Search.
- Filter.

P2. Setelah MVP:

- PDF.
- PNG.
- Barcode.
- Bulk voucher.
- CSV.
- WhatsApp share.
- Email.
- Analytics lanjutan.


## 56. Rekomendasi Arsitektur MVP

Jangan membuat sistem terlalu kompleks.

Gunakan:

Next.js
+
TypeScript
+
PostgreSQL
+
Prisma
+
Auth.js
+
Tailwind
+
shadcn/ui
+
Fabric.js
+
Supabase Storage

Semua backend tetap berada di project Next.js.

Tidak perlu:

Docker untuk MVP.

Microservices.

Redis wajib.

Kubernetes.

Separate backend.

Separate frontend.

Message queue.


## 57. MVP Final Flow

Admin:

Login
↓
Dashboard
↓
Create Voucher
↓
Select Template
↓
Customize Data
↓
Create
↓
Generate Public Link
↓
Copy Link
↓
Send to Friend


Recipient:

Open Link
↓
View Voucher
↓
Claim
↓
Fill Name
↓
Confirm
↓
Voucher Claimed


Admin:

Dashboard
↓
View Claimed Voucher
↓
Verify Recipient
↓
Redeem
↓
Voucher Redeemed


## 58. Milestone

Milestone 1:

Project dapat dijalankan lokal.

Milestone 2:

Admin dapat login.

Milestone 3:

Admin dapat membuat voucher.

Milestone 4:

Link voucher dapat dibuka publik.

Milestone 5:

Recipient dapat claim.

Milestone 6:

Admin dapat redeem.

Milestone 7:

Template dapat dibuat.

Milestone 8:

Template dapat diedit menggunakan visual editor.

Milestone 9:

Voucher menggunakan template dinamis.

Milestone 10:

Security dan testing selesai.

Milestone 11:

Production deployment.


## 59. Definition of MVP Success

MVP dianggap berhasil jika satu flow lengkap dapat berjalan tanpa manual database modification:

Admin login.

Admin membuat template.

Admin membuat voucher.

Sistem menghasilkan link.

Admin mengirim link.

Recipient membuka link.

Recipient melakukan claim.

Dashboard menunjukkan CLAIMED.

Admin melakukan redeem.

Dashboard menunjukkan REDEEMED.

Tidak ada duplicate claim.

Voucher expired tidak dapat diklaim.

Voucher cancelled tidak dapat diklaim.


## 60. Next Step Development

Mulai development dari Sprint 0.

Setelah project berhasil dibuat, implementasikan database schema.

Jangan langsung membuat visual editor.

Urutan teknis paling aman:

Database
→ Authentication
→ Voucher Service
→ Voucher CRUD
→ Public Voucher
→ Claim Transaction
→ Redeem
→ Template CRUD
→ Template Editor
→ Dynamic Rendering
→ Analytics
→ Security
→ Testing
→ Deployment

Target MVP pertama adalah membuat satu voucher bisa dibuat admin, dibagikan menggunakan link, diklaim recipient, lalu di-redeem admin. Setelah flow tersebut stabil, baru kerjakan visual template editor.