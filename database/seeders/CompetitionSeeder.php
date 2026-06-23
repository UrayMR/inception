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
        $competitions = [
            'Essay',
            'Business Plan',
            'UI/UX',
            'Data Science',
            'Hackathon',
        ];

        foreach ($competitions as $competitionName) {
            Competition::factory()
                ->create([
                    'name' => $competitionName,
                    'type' => CompetitionType::team->value,
                    'max_member' => 4,
                    'status' => fake()->randomElement([
                        CompetitionStatus::open->value,
                        CompetitionStatus::closed->value,
                    ]),
                ])
                ->each(function (Competition $competition) {
                    CompetitionTimeline::factory()
                        ->count(3)
                        ->for($competition)
                        ->create();
                });
        }
    }
}
