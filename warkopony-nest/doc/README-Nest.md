# Panduan NestJS untuk Backend Developer Laravel

> Catatan belajar praktis NestJS + TypeScript. Panduan ini dimulai dari
> terminal dan struktur folder, lalu membahas routing, controller,
> service, module, validasi, database, error handling, testing, dan
> kebiasaan membangun REST API.
>
> Contoh menggunakan npm, Nest CLI, dan API JSON. Sesuaikan nama file
> atau konfigurasi jika versi NestJS yang dipakai menghasilkan struktur
> sedikit berbeda.

## Daftar Isi

1.  [Gambaran NestJS](#1-gambaran-nestjs)
2.  [Persiapan lingkungan](#2-persiapan-lingkungan)
3.  [Command line penting](#3-command-line-penting)
4.  [Struktur direktori](#4-struktur-direktori)
5.  [Alur request NestJS](#5-alur-request-nestjs)
6.  [TypeScript dasar untuk backend](#6-typescript-dasar-untuk-backend)
7.  [Routing dan controller](#7-routing-dan-controller)
8.  [Service dan dependency
    injection](#8-service-dan-dependency-injection)
9.  [Module](#9-module)
10. [Request: params, query, dan
    body](#10-request-params-query-dan-body)
11. [DTO dan validasi](#11-dto-dan-validasi)
12. [Response JSON dan status HTTP](#12-response-json-dan-status-http)
13. [Error handling](#13-error-handling)
14. [Config dan environment](#14-config-dan-environment)
15. [Database dan ORM](#15-database-dan-orm)
16. [Authentication dan
    authorization](#16-authentication-dan-authorization)
17. [Middleware, guard, interceptor, dan
    pipe](#17-middleware-guard-interceptor-dan-pipe)
18. [Testing dengan curl](#18-testing-dengan-curl)
19. [Testing otomatis](#19-testing-otomatis)
20. [Menonaktifkan endpoint
    sementara](#20-menonaktifkan-endpoint-sementara)
21. [Struktur proyek yang
    direkomendasikan](#21-struktur-proyek-yang-direkomendasikan)
22. [Laravel vs NestJS](#22-laravel-vs-nestjs)
23. [Checklist production](#23-checklist-production)
24. [Urutan belajar](#24-urutan-belajar)

------------------------------------------------------------------------

## 1. Gambaran NestJS

NestJS adalah framework Node.js untuk membangun aplikasi server
menggunakan JavaScript atau TypeScript. NestJS menggunakan TypeScript
secara luas dan menyediakan pola seperti module, controller, provider,
dependency injection, pipe, guard, dan interceptor.

### Konsep utama

  -----------------------------------------------------------------------
  Konsep                              Tanggung jawab
  ----------------------------------- -----------------------------------
  **Module**                          Mengelompokkan controller dan
                                      provider serta menghubungkan fitur

  **Controller**                      Menentukan endpoint HTTP dan
                                      menangani request

  **Service / Provider**              Menjalankan business logic yang
                                      bisa dipakai ulang

  **DTO**                             Mendefinisikan bentuk data request
                                      dan membantu validasi runtime

  **Pipe**                            Transformasi atau validasi nilai
                                      masuk

  **Guard**                           Memutuskan apakah request boleh
                                      melanjutkan, misalnya berdasarkan
                                      autentikasi

  **Interceptor**                     Membungkus alur request/response,
                                      misalnya logging atau format
                                      response

  **Middleware**                      Menjalankan fungsi sebelum handler
                                      route

  **Exception filter**                Mengatur bagaimana exception
                                      ditangani dan dikirim sebagai
                                      response
  -----------------------------------------------------------------------

### Perbandingan cepat dengan Laravel

  -----------------------------------------------------------------------
  Laravel                             NestJS
  ----------------------------------- -----------------------------------
  `routes/api.php`                    Decorator route di controller,
                                      seperti `@Get()` dan `@Post()`

  Controller                          Controller

  Business logic di controller atau   Umumnya dipisahkan ke
  service class buatan sendiri        service/provider

  Service container                   Dependency injection NestJS

  Form Request                        DTO + `ValidationPipe`

  Middleware                          Middleware

  Middleware/authorization policy     Guard dan mekanisme authorization

  Eloquent atau repository            ORM/model/repository yang dipilih

  Artisan                             Nest CLI (`nest`)

  PHPUnit/Pest                        Jest dan Supertest pada setup
                                      standar
  -----------------------------------------------------------------------

Padanan ini tidak selalu satu banding satu. Contohnya, NestJS Module
bukan persis sama dengan Laravel Service Provider.

------------------------------------------------------------------------

## 2. Persiapan lingkungan

### Periksa Node.js dan npm

``` bash
node --version
npm --version
```

Gunakan versi Node.js LTS yang didukung oleh versi NestJS yang dipasang.
Jika proyek sudah ada, cek `package.json` dan dokumentasi versi proyek
tersebut.

### Membuat proyek baru

``` bash
npm i -g @nestjs/cli
nest new my-api
cd my-api
npm run start:dev
```

Jika tidak ingin memasang CLI secara global:

``` bash
npx @nestjs/cli new my-api
cd my-api
npm run start:dev
```

Secara default, aplikasi biasanya berjalan pada port `3000`. Periksa
output terminal atau file `src/main.ts` untuk memastikan port yang
dipakai.

Buka terminal kedua untuk menguji:

``` bash
curl -i http://localhost:3000
```

### Jika proyek NestJS sudah dibuat

Jangan membuat proyek baru lagi. Masuk ke direktori proyek lalu
jalankan:

``` bash
npm install
npm run start:dev
```

------------------------------------------------------------------------

## 3. Command line penting

### Menjalankan aplikasi

``` bash
npm run start       # Menjalankan aplikasi
npm run start:dev   # Mode development dengan watch
npm run start:debug # Mode debug/watch, jika tersedia pada project
npm run build       # Build TypeScript
npm run start:prod  # Menjalankan hasil build, jika script tersedia
```

Periksa script sebenarnya di `package.json`; script bisa berbeda
tergantung template atau versi.

### Nest CLI

``` bash
nest --help
nest g module users
nest g controller users
nest g service users
nest g resource products
```

Jika CLI global tidak terpasang, gunakan:

``` bash
npx nest g module users
npx nest g controller users
npx nest g service users
```

`nest g resource products` dapat menghasilkan kerangka CRUD. Untuk
belajar, buat controller dan service sendiri terlebih dahulu agar
alurnya lebih mudah dipahami.

### Memeriksa proyek

``` bash
pwd
ls -la
find src -maxdepth 3 -type f
cat package.json
```

### Quality checks

``` bash
npm run lint
npm run format
npm test
npm run test:e2e
```

Jalankan script yang memang tersedia di `package.json`. Tidak semua
template memiliki nama script yang sama.

------------------------------------------------------------------------

## 4. Struktur direktori

Struktur awal hasil generator biasanya kurang lebih seperti ini:

``` text
my-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── app.controller.spec.ts
├── test/
│   └── app.e2e-spec.ts
├── node_modules/
├── package.json
├── package-lock.json
├── tsconfig.json
├── nest-cli.json
└── eslint.config.mjs
```

File dapat berbeda antarversi dan konfigurasi.

### Fungsi file penting

-   **`src/main.ts`**: entry point. Mem-bootstrap aplikasi dan mengatur
    konfigurasi global.
-   **`src/app.module.ts`**: root module aplikasi.
-   **`src/app.controller.ts`**: controller contoh.
-   **`src/app.service.ts`**: service contoh.
-   **`*.spec.ts`**: file unit test.
-   **`test/`**: biasanya berisi end-to-end test.
-   **`package.json`**: dependencies dan script npm.
-   **`tsconfig.json`**: konfigurasi compiler TypeScript.
-   **`nest-cli.json`**: konfigurasi Nest CLI.
-   **`node_modules/`**: dependency hasil instalasi npm; umumnya tidak
    dimasukkan ke Git.

### Contoh struktur fitur

``` text
src/
├── main.ts
├── app.module.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── users.controller.spec.ts
└── auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── auth.service.ts
    └── dto/
```

Satu fitur biasanya memiliki module, controller, service, DTO, dan test
sendiri. Tidak semua proyek harus memakai struktur yang sama; pilih
struktur yang memudahkan pemeliharaan.

------------------------------------------------------------------------

## 5. Alur request NestJS

Contoh alur REST API:

``` text
Client / curl
     |
     v
Middleware (jika ada)
     |
     v
Guard (jika ada)
     |
     v
Interceptor sebelum handler (jika ada)
     |
     v
Pipe: transform / validation (jika ada)
     |
     v
Controller
     |
     v
Service
     |
     v
ORM / Repository / Database
     |
     v
Response kembali ke client
```

Ini gambaran umum; detail urutan dan fase setelah handler bergantung
pada komponen yang dipasang.

Prinsip pembagian tanggung jawab:

-   **Controller**: menerima request, mengambil parameter, memanggil
    service, dan menentukan response yang sesuai.
-   **Service**: menjalankan aturan bisnis dan mengoordinasikan
    pekerjaan aplikasi.
-   **Database layer**: membaca atau mengubah data.
-   **DTO dan pipe**: memvalidasi atau mentransformasikan input.
-   **Guard**: memeriksa akses request.

Controller boleh sederhana. Jangan menaruh semua query, aturan bisnis,
autentikasi, dan format data dalam satu method raksasa.

------------------------------------------------------------------------

## 6. TypeScript dasar untuk backend

TypeScript menambahkan sistem tipe pada JavaScript. Tipe membantu editor
dan compiler menemukan kesalahan, tetapi tipe biasa akan dihapus saat
runtime. Karena itu, input HTTP tetap perlu validasi runtime.

### Variabel dan tipe

``` ts
const name: string = 'Saifuddin';
let age: number = 20;
const isActive: boolean = true;

const tags: string[] = ['backend', 'nestjs'];
const scores: number[] = [80, 90, 95];
```

Gunakan `const` secara default; gunakan `let` jika nilai memang perlu
diubah. Hindari `var` pada kode baru.

### Object dan interface

``` ts
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // opsional
}

const user: User = {
  id: 1,
  name: 'Saifuddin',
  email: 'saifuddin@example.com',
};
```

`interface` mendefinisikan bentuk object untuk pemeriksaan tipe saat
compile time.

### Function dan return type

``` ts
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string): string {
  return `Halo, ${name}`;
}
```

Pada service, tipe return bisa dibuat eksplisit untuk kontrak yang lebih
jelas.

### Union type

``` ts
type UserStatus = 'active' | 'inactive' | 'suspended';

function setStatus(status: UserStatus): void {
  console.log(status);
}
```

`void` menunjukkan bahwa fungsi tidak dimaksudkan untuk mengembalikan
nilai.

### Array methods

``` ts
const users = [
  { id: 1, name: 'Ayu' },
  { id: 2, name: 'Bima' },
];

const names = users.map((user) => user.name);
const found = users.find((user) => user.id === 1);
const activeUsers = users.filter((user) => user.id > 1);
```

### Destructuring dan spread

``` ts
const user = { id: 1, name: 'Ayu' };
const { id, name } = user;

const updatedUser = {
  ...user,
  name: 'Bima',
};
```

### Generic dasar

``` ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = firstItem<string>(['Ayu', 'Bima']);
```

Generic memungkinkan fungsi atau class bekerja dengan berbagai tipe
sambil mempertahankan pemeriksaan tipe.

### Class dan constructor

``` ts
class Greeter {
  constructor(private readonly prefix: string) {}

  greet(name: string): string {
    return `${this.prefix}, ${name}`;
  }
}
```

`private readonly prefix` adalah parameter property TypeScript. Nilainya
disimpan sebagai properti class dan tidak dapat di-assign ulang setelah
inisialisasi.

### Promise dan async/await

``` ts
async function loadData(): Promise<string> {
  const result = await Promise.resolve('data');
  return result;
}
```

Banyak operasi database dan jaringan bersifat asynchronous. Di service
NestJS, gunakan `async`/`await` jika operasi yang dipanggil
mengembalikan Promise.

### Optional chaining dan nullish coalescing

``` ts
const city = user.profile?.city;
const page = requestedPage ?? 1;
```

-   `?.` mengakses properti hanya jika nilai sebelumnya bukan `null`
    atau `undefined`.
-   `??` memakai nilai default hanya jika nilai kiri `null` atau
    `undefined`, bukan ketika nilainya `0` atau string kosong.

### `type`, `interface`, `unknown`, dan `any`

-   Gunakan `interface` atau `type` untuk mendefinisikan bentuk data.
-   Hindari `any` jika memungkinkan karena melemahkan pemeriksaan tipe.
-   Gunakan `unknown` untuk nilai yang belum diketahui, lalu validasi
    atau persempit tipenya sebelum digunakan.

------------------------------------------------------------------------

## 7. Routing dan controller

### Controller paling sederhana

``` ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('tes')
  getSapa(): string {
    return 'AWOOOOOOO';
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
```

Endpoint yang didaftarkan:

-   `GET /tes`
-   `GET /`

`@Controller()` menetapkan prefix controller. `@Get('tes')` menetapkan
method HTTP dan path untuk method tersebut.

### Prefix controller

``` ts
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne() {
    return {};
  }
}
```

Endpoint:

-   `GET /users`
-   `GET /users/:id`

### Method HTTP umum

``` ts
@Get()       // GET
@Post()      // POST
@Put(':id')  // PUT
@Patch(':id')// PATCH
@Delete(':id')// DELETE
```

### Route parameter

``` ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }
}
```

Parameter URL pada dasarnya diterima sebagai string. Jika memerlukan
integer, gunakan `ParseIntPipe`:

``` ts
import { ParseIntPipe } from '@nestjs/common';

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id };
}
```

### Query parameter

Request: `GET /users?page=2&limit=10`

``` ts
import { Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return {
      page: Number(page),
      limit: Number(limit),
    };
  }
}
```

Contoh ini hanya menunjukkan cara membaca query. Untuk API sungguhan,
validasi dan transformasikan nilainya menggunakan DTO dan pipe.

### Prefix API global

Di `src/main.ts`:

``` ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Setelah `setGlobalPrefix('api')`, `@Controller('users')` dengan `@Get()`
menghasilkan `GET /api/users`.

Jangan menambahkan prefix global dan mengulang `api` di setiap
`@Controller()` kecuali memang sengaja menginginkan path ganda.

------------------------------------------------------------------------

## 8. Service dan dependency injection

Service biasanya berisi business logic.

### Service

``` ts
import { Injectable, NotFoundException } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Saifuddin',
      email: 'saifuddin@example.com',
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }
}
```

### Controller menggunakan service

``` ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
```

`constructor(private readonly usersService: UsersService)` meminta
NestJS meng-inject instance `UsersService`. Ini adalah dependency
injection.

Service harus terdaftar pada `providers` di module yang sesuai.

### Penting

Contoh array di atas hanya menyimpan data dalam memory. Data hilang
ketika proses aplikasi restart, dan array bukan pengganti database
production.

------------------------------------------------------------------------

## 9. Module

Module mengelompokkan controller dan provider.

``` ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

-   `controllers`: controller yang didaftarkan di module.
-   `providers`: service/provider yang tersedia untuk dependency
    injection di module.
-   `imports`: module lain yang dibutuhkan.
-   `exports`: provider yang ingin digunakan module lain.

Root module harus mengimpor feature module:

``` ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

Jika module lain perlu menggunakan `UsersService`, ekspor service dari
`UsersModule` lalu impor `UsersModule` ke module pemakai.

### Generate komponen

``` bash
nest g module users
nest g controller users
nest g service users
```

Periksa hasil generator agar nama module, path import, controller, dan
provider sesuai dengan struktur proyek.

------------------------------------------------------------------------

## 10. Request: params, query, dan body

### Ringkasan

  Dekorator                     Sumber data      Contoh
  ----------------------------- ---------------- --------------------------------------
  `@Param('id')`                Path parameter   `/users/12`
  `@Query('page')`              Query string     `/users?page=2`
  `@Body()`                     Request body     JSON pada POST/PATCH
  `@Headers('authorization')`   Header HTTP      Bearer token
  `@Req()`                      Request object   Akses object request secara langsung

Lebih baik gunakan dekorator spesifik seperti `@Param()`, `@Query()`,
dan `@Body()` jika hanya membutuhkan bagian tertentu dari request.

### Contoh request body

``` ts
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() body: { name: string; email: string }) {
    return {
      message: 'Data diterima',
      data: body,
    };
  }
}
```

Tipe TypeScript tersebut tidak otomatis memvalidasi JSON dari client
pada runtime. Gunakan DTO dan `ValidationPipe` untuk validasi sungguhan.

------------------------------------------------------------------------

## 11. DTO dan validasi

DTO (Data Transfer Object) menjelaskan bentuk data yang diterima atau
dikirim melalui batas aplikasi. Untuk validasi runtime dengan decorator,
NestJS lazim menggunakan `class-validator` dan `class-transformer`.

### Instal dependency

``` bash
npm install class-validator class-transformer
```

### DTO create

`src/users/dto/create-user.dto.ts`:

``` ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;
}
```

### DTO update

`src/users/dto/update-user.dto.ts`:

``` ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

Jika paket `@nestjs/mapped-types` belum tersedia pada proyek, pasang
sesuai panduan versi NestJS:

``` bash
npm install @nestjs/mapped-types
```

`PartialType` membuat field dari DTO create menjadi opsional untuk
update. Sesuaikan aturan jika ada field yang tidak boleh diubah.

### Aktifkan global ValidationPipe

Di `src/main.ts`:

``` ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Penjelasan:

-   `whitelist: true`: menghapus properti yang tidak memiliki decorator
    validasi dari DTO.
-   `forbidNonWhitelisted: true`: menolak request yang mengandung
    properti asing, alih-alih hanya menghapusnya.
-   `transform: true`: mengaktifkan transformasi input ke tipe DTO yang
    sesuai jika memungkinkan.

Pilih konfigurasi berdasarkan kebutuhan API. Untuk endpoint sensitif,
menolak field yang tidak dikenal sering lebih aman dan eksplisit.

### Gunakan DTO di controller

``` ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return {
      message: 'User diterima',
      data: dto,
    };
  }
}
```

Tanpa `ValidationPipe` dan decorator validasi, tipe DTO saja tidak cukup
untuk menolak input tidak valid saat runtime.

------------------------------------------------------------------------

## 12. Response JSON dan status HTTP

NestJS secara default menserialisasi object dan array yang dikembalikan
controller menjadi JSON.

### Response JSON

``` ts
@Get('health')
health() {
  return {
    success: true,
    message: 'API berjalan',
    data: null,
  };
}
```

Ini serupa dengan:

``` php
return response()->json([
    'success' => true,
    'message' => 'API berjalan',
    'data' => null,
]);
```

String biasa biasanya dikirim sebagai response teks, bukan object JSON.
Jika ingin response JSON, kembalikan object atau array.

### Status code

``` ts
import { HttpCode, HttpStatus, Post } from '@nestjs/common';

@Post()
@HttpCode(HttpStatus.CREATED)
create() {
  return {
    message: 'Data berhasil dibuat',
  };
}
```

Secara default, handler `POST` umumnya memakai status `201 Created`,
sedangkan handler lain umumnya `200 OK`. Gunakan `@HttpCode()` ketika
perlu menentukan status secara eksplisit.

Status umum:

  -----------------------------------------------------------------------
  Status                              Makna
  ----------------------------------- -----------------------------------
  `200 OK`                            Request berhasil

  `201 Created`                       Resource berhasil dibuat

  `204 No Content`                    Berhasil tanpa body response

  `400 Bad Request`                   Input/request tidak valid

  `401 Unauthorized`                  Autentikasi diperlukan atau gagal

  `403 Forbidden`                     Tidak memiliki izin

  `404 Not Found`                     Resource tidak ditemukan

  `409 Conflict`                      Konflik dengan keadaan resource

  `422 Unprocessable Entity`          Sering digunakan untuk kegagalan
                                      validasi, jika aplikasi mengaturnya
                                      demikian

  `500 Internal Server Error`         Kesalahan server yang tidak
                                      ditangani secara spesifik
  -----------------------------------------------------------------------

Hindari mengembalikan status `200` untuk semua kondisi jika status HTTP
lain lebih tepat.

------------------------------------------------------------------------

## 13. Error handling

NestJS menyediakan exception bawaan yang menghasilkan response HTTP yang
sesuai.

``` ts
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
```

Contoh:

``` ts
findOne(id: number) {
  const user = this.users.find((item) => item.id === id);

  if (!user) {
    throw new NotFoundException('User tidak ditemukan');
  }

  return user;
}
```

Jangan mengirim detail internal, stack trace, query SQL, token, atau
rahasia lain kepada client. Catat detail teknis di server menggunakan
logging yang aman.

Jika format error API perlu konsisten, pertimbangkan exception filter
global. Jangan membuat `try/catch` berulang pada semua controller jika
exception bawaan sudah cukup menangani kasus tersebut.

------------------------------------------------------------------------

## 14. Config dan environment

Jangan menaruh password database, secret token, atau credential dalam
source code.

### Instal ConfigModule

``` bash
npm install @nestjs/config
```

Di root module:

``` ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

Contoh `.env` lokal:

``` dotenv
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=replace-with-a-long-random-secret
```

Jangan commit `.env` yang berisi secret. Pastikan `.env` masuk
`.gitignore`, dan sediakan `.env.example` tanpa credential sungguhan.

Mengambil konfigurasi:

``` ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExampleService {
  constructor(private readonly configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }
}
```

Untuk aplikasi production, tambahkan validasi schema environment saat
startup sehingga aplikasi gagal dengan pesan jelas jika konfigurasi
wajib tidak tersedia.

------------------------------------------------------------------------

## 15. Database dan ORM

NestJS tidak mewajibkan satu ORM tertentu. Pilih sesuai kebutuhan dan
ekosistem tim, misalnya Prisma, TypeORM, atau solusi lain yang didukung.

Pertimbangan:

-   **Prisma**: schema dan client bertipe, migration workflow yang
    jelas.
-   **TypeORM**: pendekatan entity dan integrasi NestJS yang umum.
-   **SQL langsung**: bisa cocok untuk query yang spesifik, tetapi perlu
    disiplin keamanan dan pengelolaan query.

### Prinsip penting

1.  Simpan konfigurasi database di environment.
2.  Gunakan parameterized query atau API ORM yang aman; jangan
    menggabungkan input user langsung ke SQL.
3.  Gunakan migration yang tercatat di version control.
4.  Gunakan transaksi untuk operasi yang harus berhasil atau gagal
    sebagai satu unit.
5.  Tambahkan index pada kolom yang relevan dengan query dan relasi.
6.  Hindari N+1 query dan mengambil seluruh data tanpa batas.
7.  Terapkan pagination, filter, dan sorting dengan validasi.
8.  Jangan menganggap tipe TypeScript sebagai validasi database atau
    request.
9.  Jangan menjalankan migration destruktif secara otomatis di
    production tanpa prosedur deployment yang aman.

### Contoh pola controller-service

Controller:

``` ts
@Get()
findAll() {
  return this.usersService.findAll();
}
```

Service:

``` ts
findAll() {
  return this.userRepository.findMany();
}
```

`userRepository` di atas hanya ilustrasi nama abstraksi. Implementasi
sebenarnya bergantung pada ORM yang dipilih; jangan menyalin contoh ini
tanpa membuat repository/client dan mendaftarkan dependensinya.

------------------------------------------------------------------------

## 16. Authentication dan authorization

Dua konsep berbeda:

-   **Authentication**: memastikan identitas pemanggil, misalnya melalui
    session atau token.
-   **Authorization**: menentukan tindakan apa yang boleh dilakukan
    identitas tersebut.

NestJS mendukung guard untuk melindungi route. Untuk JWT, gunakan
strategi/library yang sesuai dengan versi NestJS dan kebutuhan aplikasi.
Jangan membuat algoritma token sendiri.

Prinsip keamanan:

-   Jangan menyimpan password sebagai plaintext; gunakan password
    hashing yang sesuai.
-   Validasi token, signature, issuer/audience jika relevan, dan masa
    berlaku.
-   Jangan menaruh secret di source code.
-   Terapkan otorisasi di server, bukan hanya menyembunyikan tombol di
    frontend.
-   Periksa kepemilikan resource; user tidak boleh bisa mengakses data
    orang lain hanya dengan mengganti ID.
-   Terapkan rate limit untuk endpoint sensitif seperti login.
-   Jangan mencatat token atau password di log.
-   Tentukan kebijakan logout, expiry, refresh token, dan pencabutan
    sesi sesuai kebutuhan.

Untuk belajar, pahami request lifecycle dan guard terlebih dahulu
sebelum menambahkan autentikasi ke semua endpoint.

------------------------------------------------------------------------

## 17. Middleware, guard, interceptor, dan pipe

  -----------------------------------------------------------------------
  Komponen                            Kegunaan umum
  ----------------------------------- -----------------------------------
  Middleware                          Log request, menambahkan konteks,
                                      atau pekerjaan awal sebelum route
                                      handler

  Guard                               Autentikasi dan otorisasi: bolehkah
                                      request masuk ke handler?

  Pipe                                Validasi atau transformasi
                                      parameter/body

  Interceptor                         Logging waktu, mapping response,
                                      caching, atau membungkus eksekusi
                                      handler

  Exception filter                    Menangani exception dan membentuk
                                      response error
  -----------------------------------------------------------------------

Gunakan komponen berdasarkan tanggung jawabnya. Misalnya, validasi DTO
cocok memakai pipe; pemeriksaan akses route cocok memakai guard.

### Prefix global

Gunakan `app.setGlobalPrefix('api')` jika seluruh API ingin memakai
prefix `/api`.

### CORS

CORS mengatur browser mana yang diizinkan mengakses API lintas origin.
CORS bukan pengganti autentikasi atau otorisasi.

Contoh konfigurasi harus disesuaikan dengan origin frontend yang benar;
hindari mengizinkan semua origin secara sembarangan pada aplikasi yang
memakai credential.

------------------------------------------------------------------------

## 18. Testing dengan curl

`curl` berguna untuk menguji API tanpa menunggu frontend selesai.

### GET

``` bash
curl -i http://localhost:3000/api/users
```

### GET dengan path parameter

``` bash
curl -i http://localhost:3000/api/users/1
```

### GET dengan query

``` bash
curl -i 'http://localhost:3000/api/users?page=1&limit=10'
```

### POST JSON

``` bash
curl -i -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bwang","email":"bwang@example.com"}'
```

### PATCH JSON

``` bash
curl -i -X PATCH http://localhost:3000/api/users/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Nama Baru"}'
```

### DELETE

``` bash
curl -i -X DELETE http://localhost:3000/api/users/1
```

Endpoint harus benar-benar diimplementasikan sebelum perintah tersebut
menghasilkan response yang diharapkan.

### Melihat body saja

``` bash
curl -s http://localhost:3000/api/users
```

### Format JSON dengan jq

``` bash
curl -s http://localhost:3000/api/users | jq
```

`-i` menampilkan header HTTP bersama body; `-s` menghilangkan progress
meter. Untuk debugging jaringan, `curl -v` dapat menampilkan detail
request/response, tetapi hindari membagikan output yang berisi
credential atau token.

### Bearer token

``` bash
curl -i http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

Simpan token secara aman. Jangan menaruh token asli ke README atau
commit ke repository.

------------------------------------------------------------------------

## 19. Testing otomatis

NestJS biasanya menyediakan Jest untuk unit test dan Supertest untuk
end-to-end test, tergantung template.

### Unit test

Unit test menguji class atau fungsi secara terisolasi. Mock dependency
eksternal seperti database atau HTTP client jika diperlukan.

Jalankan:

``` bash
npm test
```

### End-to-end test

E2E test memeriksa alur HTTP aplikasi, termasuk routing dan integrasi
komponen yang dipasang.

``` bash
npm run test:e2e
```

Periksa script di `package.json`. Pastikan test tidak bergantung pada
data production dan menggunakan database atau konfigurasi test yang
terpisah.

### Apa yang perlu diuji?

-   Status HTTP yang benar.
-   Bentuk response JSON.
-   Validasi input tidak valid.
-   Data tidak ditemukan.
-   Hak akses user.
-   Duplikasi dan konflik.
-   Pagination dan filter.
-   Perilaku transaksi dan error database.
-   Kasus batas, seperti ID tidak valid dan body kosong.

------------------------------------------------------------------------

## 20. Menonaktifkan endpoint sementara

### Opsi A: hilangkan decorator route

Sebelum:

``` ts
@Get('report')
getReport() {
  return this.reportService.getReport();
}
```

Sementara:

``` ts
getReport() {
  return this.reportService.getReport();
}
```

Method tersebut masih merupakan method class biasa, tetapi tidak
didaftarkan sebagai HTTP route melalui `@Get()`.

### Opsi B: keluarkan controller dari module

``` ts
@Module({
  controllers: [],
  providers: [ReportService],
})
export class ReportsModule {}
```

Ini menonaktifkan registrasi controller dari module tersebut. Periksa
dependensi sebelum melakukannya.

### Opsi C: route tetap terdaftar tetapi belum diimplementasikan

``` ts
import {
  Controller,
  Get,
  NotImplementedException,
} from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get()
  getReport(): never {
    throw new NotImplementedException('Endpoint belum tersedia');
  }
}
```

Opsi C mengembalikan HTTP `501 Not Implemented`, tetapi route masih
dapat dipanggil. Pilih berdasarkan apakah endpoint harus tidak tersedia
sama sekali atau perlu memberi respons eksplisit.

------------------------------------------------------------------------

## 21. Struktur proyek yang direkomendasikan

Untuk API yang mulai tumbuh, kelompokkan kode berdasarkan fitur/domain:

``` text
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── decorators/
├── config/
├── users/
│   ├── dto/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.controller.spec.ts
├── auth/
│   ├── dto/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
└── products/
    ├── dto/
    ├── products.module.ts
    ├── products.controller.ts
    └── products.service.ts
```

Jangan membuat abstraksi hanya demi banyak folder. Mulai dari struktur
sederhana, lalu pisahkan komponen ketika ada kebutuhan yang jelas.

### Tanggung jawab yang sehat

-   Controller: HTTP dan pemanggilan use case/service.
-   Service: aturan bisnis.
-   DTO: bentuk dan validasi input.
-   Repository/ORM: akses data.
-   Guard: akses dan izin.
-   Filter/interceptor: perilaku lintas fitur.

Tidak harus semua fitur memiliki repository class sendiri. Gunakan
abstraksi jika membantu pengujian, pergantian implementasi, atau menjaga
domain tetap terpisah.

------------------------------------------------------------------------

## 22. Laravel vs NestJS

  ------------------------------------------------------------------------------
  Topik                   Laravel                   NestJS
  ----------------------- ------------------------- ----------------------------
  Routing                 Biasanya deklarasi di     Decorator pada controller
                          file route                

  Bahasa                  PHP                       TypeScript/JavaScript

  Runtime                 PHP runtime dan ekosistem Node.js
                          Laravel                   

  Dependency injection    Container Laravel         Container NestJS

  Validasi                Validator/Form Request    DTO, `class-validator`, pipe

  ORM                     Eloquent bawaan           Pilihan ORM/library

  JSON response           `response()->json(...)`   Return object/array untuk
                                                    JSON

  CLI                     Artisan                   Nest CLI + npm scripts

  Arsitektur              Fleksibel; logic sering   Struktur
                          dimulai di controller     module/controller/provider
                                                    yang eksplisit

  Testing                 PHPUnit/Pest              Jest/Supertest pada setup
                                                    umum
  ------------------------------------------------------------------------------

### Contoh paling sederhana

Laravel:

``` php
Route::get('/tes', function () {
    return response()->json([
        'message' => 'AWOOOOOOO',
    ]);
});
```

NestJS:

``` ts
@Controller()
export class AppController {
  @Get('tes')
  getSapa() {
    return {
      message: 'AWOOOOOOO',
    };
  }
}
```

Keduanya bisa memberikan JSON serupa. Perbedaan utamanya adalah cara
framework mendaftarkan route dan mengorganisasi aplikasi.

------------------------------------------------------------------------

## 23. Checklist production

Sebelum API dipakai pengguna sungguhan, periksa:

-   [ ] Validasi semua input dari client.
-   [ ] Gunakan status HTTP yang sesuai.
-   [ ] Jangan membocorkan stack trace, secret, atau detail internal.
-   [ ] Gunakan autentikasi dan authorization sesuai kebutuhan.
-   [ ] Validasi kepemilikan resource, bukan hanya ID.
-   [ ] Gunakan konfigurasi environment yang divalidasi.
-   [ ] Jangan commit `.env`, credential, atau token.
-   [ ] Gunakan query parameterized atau ORM API yang aman.
-   [ ] Gunakan migration dan backup database yang sesuai.
-   [ ] Terapkan pagination dan batas ukuran request.
-   [ ] Tambahkan logging dan monitoring yang tidak menyimpan secret.
-   [ ] Konfigurasikan CORS sesuai origin yang benar.
-   [ ] Terapkan rate limiting untuk endpoint sensitif.
-   [ ] Jalankan lint, build, unit test, dan E2E test di CI.
-   [ ] Uji error database, timeout, dan dependensi eksternal.
-   [ ] Gunakan HTTPS di deployment.
-   [ ] Pastikan proses deployment dan rollback terdokumentasi.

Checklist ini merupakan titik awal; kebutuhan keamanan dan operasional
bergantung pada aplikasi.

------------------------------------------------------------------------

## 24. Urutan belajar

Untuk developer yang sudah memahami backend Laravel dan terbiasa menguji
API dengan `curl`, urutan yang disarankan:

1.  **Dasar TypeScript**: type, interface, class, Promise, async/await.
2.  **Routing**: `@Controller`, `@Get`, `@Post`, `@Patch`, `@Delete`.
3.  **Request**: `@Param`, `@Query`, `@Body`.
4.  **Module dan dependency injection**: controller, service, provider,
    imports/exports.
5.  **DTO dan validasi**: `class-validator`, `ValidationPipe`.
6.  **HTTP response dan exception**: status code, `NotFoundException`,
    `ConflictException`.
7.  **Database**: pilih ORM, migration, relasi, pagination, transaksi.
8.  **Authentication**: guard, session/JWT, role dan permission.
9.  **Testing**: unit test dan E2E dengan Supertest.
10. **Production**: config validation, logging, rate limit, deployment
    dan monitoring.

### Latihan pertama

Buat endpoint berikut dan uji semuanya dengan `curl`:

-   `GET /api/health` → status aplikasi.
-   `GET /api/users` → daftar user.
-   `GET /api/users/:id` → detail user atau `404`.
-   `POST /api/users` → buat user dengan validasi.
-   `PATCH /api/users/:id` → update sebagian data.
-   `DELETE /api/users/:id` → hapus user.

Mulai dengan data sementara untuk memahami alur request, lalu ganti
dengan database sebelum menganggap CRUD tersebut siap digunakan
sungguhan.

------------------------------------------------------------------------

## Referensi resmi

-   NestJS Documentation: https://docs.nestjs.com/
-   NestJS Controllers: https://docs.nestjs.com/controllers
-   NestJS Providers: https://docs.nestjs.com/providers
-   NestJS Modules: https://docs.nestjs.com/modules
-   NestJS Pipes: https://docs.nestjs.com/pipes
-   NestJS Validation: https://docs.nestjs.com/techniques/validation
-   NestJS Exception Filters: https://docs.nestjs.com/exception-filters
-   TypeScript Handbook:
    https://www.typescriptlang.org/docs/handbook/intro.html
-   Node.js Documentation: https://nodejs.org/docs/

------------------------------------------------------------------------

**Catatan akhir:** README ini adalah peta belajar dan referensi ringkas,
bukan pengganti dokumentasi resmi. Periksa versi NestJS, Node.js, dan
paket yang digunakan proyek sebelum menyalin konfigurasi ke aplikasi
nyata.
