<?php

namespace Database\Factories;

use App\Models\CompetitionTimeline;
use App\Models\Competition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CompetitionTimeline>
 */
class CompetitionTimelineFactory extends Factory
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
      'timeline_name' => $this->faker->sentence(2),
      'description' => $this->faker->optional()->paragraph(),
      'sequence' => $this->faker->numberBetween(1, 5),
      'start_at' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
      'end_at' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
      'status' => $this->faker->randomElement(['closed', 'open', 'ongoing', 'completed']),
    ];
  }
}
