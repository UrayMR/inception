<?php

namespace Database\Seeders;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Illuminate\Database\Seeder;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        Competition::factory()
            ->count(5)
            ->create([
                'type' => CompetitionType::solo->value,
                'max_member' => 1,
                'status' => CompetitionStatus::open->value,
            ])
            ->each(function (Competition $competition) {
                CompetitionTimeline::factory()
                    ->count(3)
                    ->for($competition)
                    ->create();
            });

        Competition::factory()
            ->count(5)
            ->create([
                'type' => CompetitionType::team->value,
                'max_member' => rand(2, 5),
                'status' => CompetitionStatus::open->value,
            ])
            ->each(function (Competition $competition) {
                CompetitionTimeline::factory()
                    ->count(3)
                    ->for($competition)
                    ->create();
            });
    }
}
