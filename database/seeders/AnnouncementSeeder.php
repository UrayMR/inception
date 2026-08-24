<?php

namespace Database\Seeders;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
  /**
   * Seed the database.
   */
  public function run(): void
  {
    Announcement::updateOrCreate([
      'id' => 1,
    ], [
      'message' => 'Pendaftaran INCEPTION 2026 resmi dibuka. Waktunya buktikan inovasi timmu dan amankan slot sekarang!',
      'status' => AnnouncementStatus::active->value,
    ]);
  }
}
