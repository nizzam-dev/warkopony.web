# Setup Guide — NestJS + PostgreSQL + Prisma

Panduan ini digunakan untuk menjalankan project di komputer baru setelah `git clone`, atau menyiapkan ulang environment setelah `git pull`.

## Stack

- NestJS
- PostgreSQL 17 melalui Docker Compose
- Prisma ORM 7.10.1
- PostgreSQL driver adapter: `@prisma/adapter-pg` + `pg`
- npm

## 1. Prasyarat

Pastikan sudah terpasang:

```bash
node -v
npm -v
docker -v
docker compose version
```

Gunakan versi Node.js yang sesuai dengan `engines` di `package.json` jika field tersebut tersedia.

## 2. Clone repository

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_PROJECT>
```

Jika repository sudah ada di komputer:

```bash
git pull
```

## 3. Install dependency

Gunakan `npm ci` jika repository menyertakan `package-lock.json`:

```bash
npm ci
```

`npm ci` memasang dependency berdasarkan lockfile agar versi dependency konsisten antaranggota tim.

Jika `package-lock.json` memang tidak tersedia, gunakan:

```bash
npm install
```

## 4. Buat file environment

Buat `.env` di root project. Jangan meminta anggota tim menyalin `.env` milik orang lain karena file tersebut berisi kredensial lokal.

Contoh untuk PostgreSQL Docker Compose di bawah:

```env
DATABASE_URL="postgresql://nexus:nexus_dev_password@localhost:5432/nexus_db?schema=public"
```

Pastikan `.env` masuk `.gitignore` dan **jangan commit** file tersebut.

Repository sebaiknya menyediakan `.env.example` yang berisi nama variabel dan contoh nilai non-rahasia. Anggota tim dapat menyalinnya:

```bash
cp .env.example .env
```

Kemudian sesuaikan nilainya jika konfigurasi lokal berbeda.

## 5. Jalankan PostgreSQL

Project menggunakan `compose.yaml` dengan konfigurasi kurang lebih seperti ini:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: nexus-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: nexus
      POSTGRES_PASSWORD: nexus_dev_password
      POSTGRES_DB: nexus_db
    ports:
      - "5432:5432"
    volumes:
      - nexus_postgres_data:/var/lib/postgresql/data

volumes:
  nexus_postgres_data:
```

Jalankan container:

```bash
docker compose up -d
docker compose ps
```

Tunggu sampai container PostgreSQL berstatus `Up` dan siap menerima koneksi. Pemeriksaan tambahan:

```bash
docker compose exec postgres pg_isready -U nexus -d nexus_db
```

Jika port `5432` sudah dipakai service lain, ubah port host di `compose.yaml` dan sesuaikan port pada `DATABASE_URL`.

## 6. Generate Prisma Client

Setelah dependency terpasang dan `.env` tersedia:

```bash
npx prisma generate
```

Prisma Client di project ini dihasilkan ke:

```text
src/generated/prisma/
```

Folder tersebut merupakan hasil generate. Jangan mengedit file di dalamnya secara manual.

## 7. Terapkan database migration

### Untuk anggota tim yang baru clone

Migration yang sudah dibuat dan di-commit ke repository diterapkan dengan:

```bash
npx prisma migrate dev
```

Perintah ini cocok untuk environment development lokal. Perintah tersebut menerapkan migration yang belum dijalankan dan dapat meminta nama migration baru jika schema lokal memiliki perubahan yang belum dibuatkan migration.

Jika hanya ingin menerapkan migration yang sudah ada tanpa membuat migration baru, gunakan:

```bash
npx prisma migrate deploy
```

Untuk environment production/staging, gunakan `migrate deploy`, bukan `migrate dev`.

### Saat mengubah schema Prisma

Setelah mengubah `prisma/schema.prisma`, buat migration baru:

```bash
npx prisma migrate dev --name nama_perubahan
npx prisma generate
```

Commit kedua hal berikut ke Git:

- `prisma/schema.prisma`
- Folder migration baru di `prisma/migrations/`

Jangan commit `.env`.

## 8. Jalankan NestJS

```bash
npm run start:dev
```

Jika konfigurasi environment dan database benar, aplikasi akan berjalan di:

```text
http://localhost:3000
```

PrismaService akan mencoba membuka koneksi saat NestJS melakukan inisialisasi module.

## Ringkasan: perintah setelah `git clone`

Jika `.env` sudah dibuat dan Docker tersedia, urutan singkatnya:

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_PROJECT>

npm ci
cp .env.example .env

docker compose up -d

npx prisma generate
npx prisma migrate dev

npm run start:dev
```

Periksa dan sesuaikan `.env` sebelum menjalankan aplikasi.

## Ringkasan: perintah setelah `git pull`

Jika hanya ada perubahan kode biasa:

```bash
git pull
npm ci
npm run start:dev
```

Jika `package-lock.json` tidak berubah, `npm ci` biasanya tidak perlu dijalankan ulang.

Jika ada migration baru dari anggota tim:

```bash
docker compose up -d
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

Jalankan `prisma generate` setelah dependency atau Prisma schema berubah agar generated client sesuai dengan schema dan versi package saat ini.

## Catatan kerja tim

1. Commit `package-lock.json` agar semua anggota tim memasang dependency yang konsisten.
2. Commit `compose.yaml`, `prisma.config.ts`, `prisma/schema.prisma`, dan `prisma/migrations/`.
3. Jangan commit `.env`, password asli, API key, atau kredensial pribadi.
4. Sediakan `.env.example` agar anggota tim tahu variabel environment yang diperlukan.
5. Setiap perubahan schema database harus disertai migration yang di-commit.
6. Jangan menjalankan `docker compose down -v` kecuali memang ingin menghapus volume database lokal. Opsi `-v` menghapus data PostgreSQL yang tersimpan di volume.
7. Jika koneksi gagal, periksa status container, port PostgreSQL, isi `DATABASE_URL`, dan log container:

```bash
docker compose logs postgres
```
