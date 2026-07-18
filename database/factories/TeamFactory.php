<?php

namespace Database\Factories;

use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'competition_id' => Competition::factory(),
            'team_name' => $this->faker->company(),
            'leader_id' => User::factory(),
            'phone_number' => $this->faker->phoneNumber(),
            'institution' => $this->faker->optional()->company(),
            'requirement_link' => $this->faker->url(),
            'status' => $this->faker->randomElement(TeamStatus::cases()),
        ];
    }
}
