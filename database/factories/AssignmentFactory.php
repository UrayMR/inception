<?php

namespace Database\Factories;

use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Models\Competition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Assignment>
 */
class AssignmentFactory extends Factory
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
      'name' => $this->faker->name(),
      'status' => $this->faker->randomElement(AssignmentStatus::cases()),
      'due_at' => $this->faker->dateTimeBetween('now', '+1 month'),
    ];
  }
}
