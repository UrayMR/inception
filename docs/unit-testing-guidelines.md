# Unit Testing Guidelines

Tujuan: menyatukan pola penulisan unit test di project agar cepat, deterministik, dan mudah dirawat.

**Ruang Lingkup**

- Dokumen ini fokus pada _unit tests_ untuk services, validators, DTOs, helpers, dan pure logic yang tidak perlu menjalankan seluruh HTTP stack.
- Feature / integration tests tetap dipakai untuk alur end-to-end (controller + FormRequest + view + actions + DB).

**Lokasi File**

- Unit tests: `tests/Unit/...` mengikuti namespace/feature area, contoh `tests/Unit/Services/Competitions/RegisterCompetitionServiceTest.php`.
- Feature tests: `tests/Feature/...` (tetap dipakai untuk controller/route/inertia flows).

**Kapan Unit vs Feature**

- Unit test: pengujian _guards_, bisnis murni, kalkulasi, dan orkestrasi yang dapat dimock. Harus cepat dan isolasi.
- Feature test: pengujian integrasi dari request->controller->service->actions->DB/storage.

**Struktur Test (AAA)**

- Gunakan komentar atau pemisah singkat: Arrange, Act, Assert.
- Pastikan assert minimal satu behavior per test.

Contoh:

Arrange: buat factory / mock / data input

Act: panggil method service atau action

Assert: periksa exception, pemanggilan mock, atau state DB

**Mocking & Isolation**

- Mock dependencies pada level service: repository, action classes, external services (file, queue, HTTP clients).
- Prefer `Mockery` (konsisten dengan codebase) untuk `shouldReceive` / `andReturnUsing` ketika pembuatan object harus terjadi saat pemanggilan.
- Jangan mock thing-under-test.

**Database & Factories**

- Untuk unit tests yang memerlukan sedikit DB (existence checks) gunakan `RefreshDatabase` dan factories.
- Jika logic bisa diuji tanpa DB, hindari DB untuk menjaga kecepatan.
- Saat menggunakan factory untuk precondition (mis. existing team), pastikan state yang dibuat relevan dan di-reset tiap test.

**Testing Services & Guards**

- Test metode `ensure*` atau guard dengan unit tests:
    - Kasus sukses (tidak menimbulkan exception)
    - Kasus gagal (memicu `ValidationException` atau `RuntimeException` sesuai helper)
- Mock action classes (mis. `StoreCompetitionRegistration`, `UpdateCompetitionRegistration`) agar test hanya memverifikasi keputusan (store vs update) bukan implementasi penulisan DB.

**Inertia / View / Vite dalam tests**

- Feature tests yang memanggil halaman Inertia dapat memicu error asset build (Vite manifest). Gunakan `$this->withoutVite()` di test yang hanya perlu assert Inertia props.

**File uploads & Storage**

- Gunakan `Storage::fake('public')` dan `UploadedFile::fake()` untuk menguji upload dan memastikan path tersimpan.

**Naming & Granularitas**

- File: `PascalCase...Test.php` sesuai guideline repo.
- Method: `snake_case`, mulai dengan `test_`, deskriptif (actor_action_result).
- Satu test satu behavior. Jika ada create/update/delete berbeda, pisahkan tests.

**Best Practices**

- Prefer unit test untuk guards dan kompleksitas branching. Feature tests untuk kontrak HTTP dan integrasi.
- Mock only external boundaries; assert that mocks were called with expected arguments.
- Use `andReturnUsing` if mocked method should create DB records lazily.
- Keep tests independent, deterministic, and fast (<100ms ideal per unit test locally).

**Run & Debug**

- Jalankan file test spesifik saat mengerjakan perubahan cepat:

```bash
vendor/bin/phpunit tests/Unit/Services/Competitions/RegisterCompetitionServiceTest.php
```

**Checklist sebelum commit**

- Semua unit tests lulus.
- Feature tests yang relevan lulus (atau ditandai/skipped dengan alasan).
- Tidak ada mocking berlebih yang menutupi bug integrasi.

---

Jika setuju, saya bisa:

- Terapkan guideline ini ke `docs/` (sudah dibuat).
- Mulai refactor tests yang ada supaya konsisten (saya sarankan men-scan file tests dan memperbaiki naming + struktur). Apakah saya lanjut ke refactor sekarang?
