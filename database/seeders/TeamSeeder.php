<?php

namespace Database\Seeders;

use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Competition::query()
            ->where('type', CompetitionType::team->value)
            ->get()
            ->each(function (Competition $competition) {
                Team::factory()
                    ->count(2)
                    ->for($competition)
                    ->create([
                        'leader_id' => User::factory()->create()->id,
                    ])
                    ->each(function (Team $team) {
                        TeamMember::factory()
                            ->count(3)
                            ->for($team)
                            ->create();
                    });
            });

        Competition::query()
            ->where('type', CompetitionType::solo->value)
            ->get()
            ->each(function (Competition $competition) {
                Team::factory()
                    ->count(2)
                    ->for($competition)
                    ->create([
                        'leader_id' => User::factory()->create()->id,
                    ]);
            });
    }
}
