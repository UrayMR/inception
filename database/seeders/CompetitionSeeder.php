<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Competition;
use App\Models\CompetitionTimeline;

class CompetitionSeeder extends Seeder
{
  public function run(): void
  {
    Competition::factory()
      ->count(5)
      ->create()
      ->each(function (Competition $competition) {
        CompetitionTimeline::factory()
          ->count(3)
          ->for($competition)
          ->create();
      });
  }
}
