# Warkopony NestJS --- Panduan Tim

Dokumen ini adalah panduan bersama untuk menyiapkan project, mengambil
perubahan dari Git, menjalankan backend, dan menggunakan CLI dasar.

**Stack:** NestJS, Node.js/npm, PostgreSQL melalui Docker Compose,
Prisma ORM, dan TypeScript.

> Jalankan perintah dari folder root repository, kecuali jika disebutkan
> lain.

## 1. Persiapan

Pastikan sudah terpasang: - Git - Node.js dan npm - Docker (Docker
Desktop atau Docker Engine) - Docker Compose

Periksa instalasi:

``` bash
git --version
node --version
npm --version
docker --version
docker compose version
```

Gunakan versi Node.js yang kompatibel dengan konfigurasi project. Jika
tersedia `.nvmrc` atau ketentuan versi di dokumentasi project, ikuti
ketentuan tersebut.

## 2. Pertama kali: clone repository

``` bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_REPOSITORY>
git switch dev
```

Jika branch `dev` belum tersedia secara lokal:

``` bash
git fetch origin
git switch --track origin/dev
```

Pasang dependency sesuai lockfile:

``` bash
npm ci
```

`npm ci` memasang dependency sesuai `package-lock.json`, sehingga
instalasi antaranggota lebih konsisten. Jangan menghapus atau
mengabaikan `package-lock.json`.

## 3. Siapkan environment variable

Jika repository menyediakan `.env.example`, salin (atau pakai yang sudh di kirim via chat):

``` bash
cp .env.example .env
```

Jika belum tersedia, buat `.env` di root project dan isi konfigurasi
lokal sesuai `docker-compose.yaml`.

Contoh `DATABASE_URL` untuk konfigurasi development:

``` env
DATABASE_URL="postgresql://nexus:nexus_dev_password@localhost:5432/nexus_db?schema=public"
```

Sesuaikan username, password, nama database, dan port dengan konfigurasi
Docker Compose project.

**Penting:** - `.env` hanya untuk konfigurasi lokal dan tidak boleh
di-commit. - `.env.example` boleh di-commit, tetapi hanya berisi contoh
atau placeholder, bukan secret asli. - Jangan membagikan password
database atau token.

## 4. Jalankan PostgreSQL

``` bash
docker compose up -d
docker compose ps
```

Untuk melihat log PostgreSQL:

``` bash
docker compose logs -f postgres
```

Tekan `Ctrl + C` untuk keluar dari tampilan log; container tidak ikut
dihentikan.

> Jangan menjalankan `docker compose down -v` sembarangan. Opsi `-v`
> menghapus volume dan dapat menghapus data database development lokal.

## 5. Siapkan Prisma dan database

Generate Prisma Client:

``` bash
npx prisma generate
```

Terapkan migration yang sudah ada di repository:

``` bash
npx prisma migrate dev
```

Pastikan folder `prisma/migrations/` ikut disimpan di Git. Anggota yang
baru clone tidak perlu membuat migration `init` baru jika migration
project sudah tersedia.

Jika project benar-benar belum memiliki migration, developer yang
menyiapkan database membuat migration awal:

``` bash
npx prisma migrate dev --name init
```

Setelah itu, commit folder `prisma/migrations/` agar anggota lain dapat
menerapkannya.

## 6. Jalankan backend

``` bash
npm run start:dev
```

Secara default NestJS biasanya berjalan di `http://localhost:3000`.

Hentikan server dengan `Ctrl + C`.

Untuk build dan menjalankan hasil build:

``` bash
npm run build
npm run start:prod
```

## 7. Workflow setelah `git pull`

Sebelum pull, amankan pekerjaan lokal dan periksa kondisi repository:

``` bash
git status
```

Ambil perubahan terbaru:

``` bash
git switch dev
git pull origin dev
```

Tidak semua perubahan membutuhkan semua perintah. Gunakan panduan
berikut:

  -----------------------------------------------------------------------
  Perubahan yang masuk                Tindakan
  ----------------------------------- -----------------------------------
  Hanya source `.ts` atau dokumentasi Biasanya tidak perlu instalasi
                                      ulang

  `package.json` atau                 Jalankan `npm ci`
  `package-lock.json`                 

  `prisma/schema.prisma` atau         Jalankan `npx prisma migrate dev`,
  `prisma/migrations/`                lalu `npx prisma generate`

  `docker-compose.yaml`               Periksa perubahan konfigurasi;
                                      jalankan `docker compose up -d`
                                      jika diperlukan

  `.env.example`                      Periksa apakah `.env` lokal perlu
                                      diperbarui

  Perubahan kode biasa                Server biasanya auto-reload; jika
                                      tidak, jalankan ulang
  -----------------------------------------------------------------------

Contoh jika dependency dan migration berubah:

``` bash
npm ci
docker compose up -d
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

Jika hanya source code berubah, biasanya cukup:

``` bash
npm run start:dev
```

Jika migration gagal, jangan langsung menghapus database atau
menjalankan reset. Periksa error dan koordinasikan dengan tim.

## 8. Workflow mengerjakan fitur

Sebelum mulai:

``` bash
git switch dev
git pull origin dev
git status
```

Disarankan membuat branch fitur:

``` bash
git switch -c feat/nama-fitur
```

Contoh:

``` bash
git switch -c feat/user-crud
```

Setelah selesai:

``` bash
git status
git diff
git add .
git diff --cached
git commit -m "feat: implement user CRUD"
git push -u origin feat/user-crud
```

Setelah push, ajukan Pull Request/Merge Request ke branch `dev` jika
workflow repository menggunakan review.

Jika tim bekerja langsung di `dev`, tetap pull sebelum mulai dan sebelum
push untuk mengurangi risiko konflik.

## 9. Format commit message

Gunakan format:

``` text
type: deskripsi singkat
```

  -----------------------------------------------------------------------------------
  Type                    Penggunaan              Contoh
  ----------------------- ----------------------- -----------------------------------
  `feat`                  Menambahkan fitur       `feat: add user registration`

  `fix`                   Memperbaiki bug         `fix: handle duplicate email`

  `chore`                 Setup atau pemeliharaan `chore: configure prisma`

  `docs`                  Dokumentasi             `docs: update setup guide`

  `refactor`              Merapikan kode tanpa    `refactor: simplify user service`
                          mengubah perilaku       

  `test`                  Menambah atau mengubah  `test: add users service tests`
                          test                    
  -----------------------------------------------------------------------------------

Hindari pesan yang terlalu umum seperti `update`, `fix`, atau `coba`.

## 10. CLI dasar

### Git

  -----------------------------------------------------------------------
  Perintah                            Fungsi
  ----------------------------------- -----------------------------------
  `git status`                        Melihat kondisi file

  `git branch`                        Melihat branch lokal

  `git switch dev`                    Pindah ke branch `dev`

  `git switch -c feat/nama`           Membuat dan pindah ke branch baru

  `git fetch origin`                  Mengambil informasi terbaru dari
                                      remote

  `git pull origin dev`               Mengambil dan menggabungkan
                                      perubahan branch `dev`

  `git add .`                         Memasukkan perubahan ke staging

  `git diff`                          Melihat perubahan yang belum
                                      di-stage

  `git diff --cached`                 Melihat perubahan yang sudah
                                      di-stage

  `git commit -m "pesan"`             Membuat commit

  `git push`                          Mengirim commit ke remote

  `git log --oneline -5`              Melihat lima commit terakhir

  `git restore nama-file`             Mengembalikan perubahan lokal yang
                                      belum di-stage

  `git restore --staged nama-file`    Mengeluarkan file dari staging
  -----------------------------------------------------------------------

**Hati-hati:** `git restore` dapat membuang perubahan lokal yang belum
di-commit.

### npm dan NestJS

  Perintah                        Fungsi
  ------------------------------- -------------------------------------
  `npm ci`                        Instal dependency sesuai lockfile
  `npm install nama-package`      Memasang dependency
  `npm install -D nama-package`   Memasang dev dependency
  `npm uninstall nama-package`    Menghapus dependency
  `npm run start:dev`             Menjalankan NestJS mode development
  `npm run build`                 Build project
  `npx nest g module nama`        Membuat module
  `npx nest g controller nama`    Membuat controller
  `npx nest g service nama`       Membuat service
  `npx nest g resource nama`      Membuat kerangka resource/CRUD

Contoh membuat Users module, controller, dan service:

``` bash
npx nest g module users
npx nest g controller users
npx nest g service users
```

### Prisma

  --------------------------------------------------------------------------
  Perintah                               Fungsi
  -------------------------------------- -----------------------------------
  `npx prisma generate`                  Generate Prisma Client

  `npx prisma validate`                  Memvalidasi schema

  `npx prisma format`                    Merapikan format schema

  `npx prisma migrate dev --name nama`   Membuat dan menerapkan migration
                                         development

  `npx prisma migrate dev`               Menerapkan migration development
                                         yang tersedia

  `npx prisma migrate status`            Memeriksa status migration

  `npx prisma studio`                    Membuka Prisma Studio

  `npx prisma db seed`                   Menjalankan seeder jika sudah
                                         dikonfigurasi
  --------------------------------------------------------------------------

### Docker Compose

  -----------------------------------------------------------------------
  Perintah                            Fungsi
  ----------------------------------- -----------------------------------
  `docker compose up -d`              Menyalakan service di background

  `docker compose ps`                 Melihat status container

  `docker compose logs -f postgres`   Melihat log PostgreSQL

  `docker compose stop`               Menghentikan container tanpa
                                      menghapusnya

  `docker compose start`              Menyalakan kembali container

  `docker compose down`               Menghentikan dan menghapus
                                      container/network project

  `docker compose down -v`            Menghapus container, network, dan
                                      volume --- berisiko menghapus data
                                      database
  -----------------------------------------------------------------------

## 11. Testing endpoint dengan curl

Backend dapat diuji tanpa frontend.

Contoh GET:

``` bash
curl -i http://localhost:3000/users
```

Contoh POST JSON:

``` bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Pengguna",
    "email": "user@example.com",
    "password": "password123"
  }'
```

Opsi `-i` menampilkan HTTP status dan response headers.

## 12. Checklist anggota baru

-   [ ] Git, Node.js/npm, dan Docker sudah terpasang.
-   [ ] Repository berhasil di-clone.
-   [ ] Sudah berada di branch `dev`.
-   [ ] `npm ci` berhasil.
-   [ ] File `.env` lokal sudah dibuat.
-   [ ] PostgreSQL berjalan melalui Docker Compose.
-   [ ] Prisma Client berhasil di-generate.
-   [ ] Migration berhasil diterapkan.
-   [ ] NestJS berhasil dijalankan.
-   [ ] Endpoint dapat diuji menggunakan `curl`.

## 13. Prinsip kerja tim

1.  Selalu cek `git status` sebelum pull, commit, atau pindah branch.
2.  Jangan commit `.env`, password, token, atau secret.
3.  Jangan menghapus migration yang sudah digunakan bersama tanpa
    koordinasi.
4.  Jangan menjalankan `docker compose down -v` tanpa memahami
    dampaknya.
5.  Jika mengubah schema Prisma, buat migration dan commit hasilnya.
6.  Jika mengubah dependency, commit `package.json` dan
    `package-lock.json`.
7.  Gunakan commit message yang menjelaskan perubahan.
8.  Jika terjadi konflik Git, pahami perubahan kedua sisi sebelum
    menyelesaikannya.
9.  Jika setup gagal, kirim pesan error lengkap beserta perintah yang
    dijalankan ke kelompok.

**Tujuan panduan ini:** semua anggota memiliki lingkungan development
yang konsisten, dapat menjalankan backend secara mandiri, dan tidak
saling merusak perubahan maupun data development.
