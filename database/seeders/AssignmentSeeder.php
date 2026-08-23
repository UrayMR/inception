<?php

namespace Database\Seeders;

use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Models\Competition;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
  public function run(): void
  {
    $assignment_name = 'Pengumpulan Final Project';

    $competitions = Competition::get(['id']);

    foreach ($competitions as $competition) {
      Assignment::updateOrCreate(
        [
          'competition_id' => $competition->id,
          'name'           => $assignment_name,
        ],
        [
          'assignment_guide_link' => 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing',
          'status'                => AssignmentStatus::inactive->value,
        ]
      );
    }
  }
}
