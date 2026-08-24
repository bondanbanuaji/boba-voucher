# Tech Stack

Dokumen ini menjelaskan teknologi yang digunakan untuk membangun Voucher Management System.

## 1. Pengembangan Aplikasi & Antarmuka

### Next.js

Framework utama untuk frontend dan backend.

Digunakan untuk:

- Membuat halaman admin.
- Membuat halaman public voucher.
- Membuat API.
- Server Actions.
- Routing.
- Server-side rendering.
- Menangani backend logic dalam satu project.

Versi yang digunakan:

Next.js 16.x


### TypeScript

Bahasa pemrograman utama.

Digunakan untuk:

- Type safety.
- Data model.
- API contract.
- Form validation.
- Database query typing.
- Mengurangi runtime error.


### Tailwind CSS

Framework CSS untuk membangun antarmuka.

Digunakan untuk:

- Layout.
- Responsive design.
- Spacing.
- Typography.
- Color system.
- Admin dashboard.
- Public voucher page.


### shadcn/ui

Library komponen UI berbasis Tailwind CSS.

Digunakan untuk:

- Button.
- Input.
- Form.
- Dialog.
- Dropdown.
- Select.
- Table.
- Card.
- Tabs.
- Toast.
- Alert.
- Sheet.
- Sidebar.

Komponen dapat dimodifikasi langsung di dalam repository.


## 2. Database & ORM

### SQLite

Database utama selama development lokal.

Digunakan untuk:

- Development.
- Local testing.
- Prototype.
- Automated testing.

Keuntungan:

- Tidak membutuhkan database server.
- Setup cepat.
- Database berbentuk satu file.
- Cocok untuk development awal.

File database:

prisma/dev.db


### Turso

Database production menggunakan Turso.

Turso menggunakan SQLite-compatible database yang cocok dengan kebutuhan aplikasi.

Digunakan untuk:

- Production database.
- Database hosting.
- Remote database access.
- Deployment database.


### Drizzle ORM

ORM utama untuk mengakses database.

Digunakan untuk:

- Database schema.
- Query database.
- Migration.
- Type-safe query.
- Relasi antar tabel.

Struktur:

Next.js
↓
Drizzle ORM
↓
SQLite / Turso


## 3. Authentication

### Better Auth

Library authentication utama.

Digunakan untuk:

- Admin login.
- Session management.
- Logout.
- Password authentication.
- Session validation.
- Protected routes.

Versi MVP hanya membutuhkan satu role:

ADMIN

Struktur:

Admin
↓
Better Auth
↓
Session
↓
Protected Admin Dashboard


## 4. Voucher Design Editor

### Fabric.js

Library canvas editor untuk membuat template voucher.

Digunakan untuk:

- Text.
- Image.
- Shape.
- QR Code.
- Barcode.
- Drag and drop.
- Resize.
- Rotate.
- Object positioning.
- Layer management.
- Canvas serialization.

Design template disimpan sebagai JSON.

Contoh:

{
  "width": 1200,
  "height": 700,
  "objects": [
    {
      "type": "text",
      "text": "{{voucher_title}}",
      "left": 100,
      "top": 100
    }
  ]
}


## 5. Validation & Form

### Zod

Library validation untuk memastikan data yang masuk sesuai schema.

Digunakan untuk:

- Voucher form.
- Claim form.
- Template form.
- Admin authentication.
- API validation.

Contoh data yang divalidasi:

- Voucher title.
- Recipient name.
- Voucher value.
- Voucher code.
- Expiry date.
- Template ID.


### React Hook Form

Library untuk mengelola form React.

Digunakan untuk:

- Create voucher.
- Edit voucher.
- Claim voucher.
- Create template.
- Admin login.

React Hook Form digunakan bersama Zod.


## 6. QR Code

### qrcode

Library untuk membuat QR Code.

Digunakan untuk membuat QR Code yang mengarah ke public voucher.

Contoh:

https://domain.com/v/Ab8kL92xP

QR Code dapat dimasukkan ke dalam template voucher.


## 7. File & Image Storage

### Supabase Storage

Storage untuk menyimpan file yang digunakan oleh template voucher.

Contoh:

- Background voucher.
- Logo.
- Recipient image.
- Template assets.
- Custom image.

File tidak disimpan langsung di SQLite atau Turso.

Database hanya menyimpan metadata dan URL file.


## 8. Testing

### TestSprite CLI

Tool untuk melakukan automated testing.

Digunakan untuk menguji:

- Admin login.
- Voucher creation.
- Voucher update.
- Voucher cancellation.
- Public voucher.
- Voucher claim.
- Voucher redemption.
- Template management.
- Error handling.
- User flow.

Target utama:

Admin membuat voucher
→
Voucher mendapatkan link
→
Recipient membuka link
→
Recipient claim
→
Admin melihat claim
→
Admin redeem


## 9. Deployment

### Vercel

Platform deployment utama aplikasi Next.js.

Digunakan untuk:

- Production deployment.
- Preview deployment.
- Automatic deployment dari Git.
- Environment variables.
- Server-side execution.

Architecture:

User
↓
Vercel
↓
Next.js
├── Admin Dashboard
├── Public Voucher
├── API
├── Server Actions
└── Better Auth
        ↓
     Drizzle ORM
        ↓
      Turso


## 10. Development Environment

### Node.js

Runtime utama untuk menjalankan Next.js dan tooling JavaScript/TypeScript.

Recommended:

Node.js 22 LTS


### Package Manager

Gunakan pnpm.

Command:

pnpm install

Development:

pnpm dev

Build:

pnpm build

Production:

pnpm start


## 11. Code Quality

### ESLint

Digunakan untuk melakukan static analysis pada TypeScript dan React.

Command:

pnpm lint


### Prettier

Digunakan untuk menjaga konsistensi format kode.

Command:

pnpm format


## 12. Version Control

### Git

Digunakan untuk version control.

Repository:

GitHub


Branch utama:

main

Branch development:

develop

Feature:

feature/*

Fix:

fix/*

Contoh:

feature/voucher-crud

feature/voucher-claim

feature/template-editor

fix/duplicate-claim


## 13. Environment Variables

Development:

DATABASE_URL=file:./dev.db

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_APP_URL=http://localhost:3000


Production:

DATABASE_URL=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=

NEXT_PUBLIC_APP_URL=

TURSO_DATABASE_URL=

TURSO_AUTH_TOKEN=

SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_STORAGE_BUCKET=


## 14. Technology Summary

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js | Frontend + Backend |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | UI styling |
| UI | shadcn/ui | UI components |
| Database Dev | SQLite | Local database |
| Database Production | Turso | Production database |
| ORM | Drizzle ORM | Database access |
| Authentication | Better Auth | Admin authentication |
| Form | React Hook Form | Form management |
| Validation | Zod | Input validation |
| Voucher Editor | Fabric.js | Template editor |
| QR Code | qrcode | QR generation |
| Storage | Supabase Storage | Image/file storage |
| Testing | TestSprite CLI | Automated testing |
| Runtime | Node.js | JavaScript runtime |
| Package Manager | pnpm | Dependency management |
| Code Quality | ESLint | Static analysis |
| Formatting | Prettier | Code formatting |
| Version Control | Git + GitHub | Source control |
| Deployment | Vercel | Application deployment |


## 15. Final Architecture

Local Development:

Next.js
+
TypeScript
+
Tailwind CSS
+
shadcn/ui
+
Better Auth
+
Drizzle ORM
+
SQLite
+
Fabric.js
+
Zod
+
React Hook Form
+
qrcode


Production:

User
↓
Vercel
↓
Next.js
├── Admin Dashboard
├── Public Voucher
├── API / Server Actions
├── Better Auth
├── Voucher Service
└── Template Service
        ↓
    Drizzle ORM
        ↓
      Turso

Template Assets:

Next.js
↓
Supabase Storage


Testing:

TestSprite CLI
↓
Next.js Application


## 16. Technology Decision

Stack final yang digunakan:

Next.js sebagai framework utama.

TypeScript sebagai bahasa pemrograman.

Tailwind CSS sebagai styling framework.

shadcn/ui sebagai UI component library.

SQLite sebagai database development.

Turso sebagai database production.

Drizzle ORM sebagai database ORM.

Better Auth sebagai authentication.

Fabric.js sebagai voucher template editor.

Zod sebagai validation.

React Hook Form sebagai form management.

qrcode sebagai QR generator.

Supabase Storage sebagai file storage.

TestSprite CLI sebagai automated testing.

GitHub sebagai source control.

Vercel sebagai deployment platform.

Stack ini dipilih karena seluruh aplikasi dapat tetap menggunakan arsitektur monolith. Frontend, backend, authentication, voucher logic, dan template management dapat dikembangkan dalam satu repository Next.js.