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

    foreach ($competitions as $competition_id) {
      Assignment::factory()->create([
        'competition_id' => $competition_id,
        'name' => $assignment_name,
        'status' => fake()->randomElement([
          AssignmentStatus::active->value,
          // AssignmentStatus::inactive->value,
        ]),
      ]);
    }
  }
}
