<?php

namespace Database\Seeders;

use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Illuminate\Database\Seeder;

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
