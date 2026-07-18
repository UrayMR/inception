<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AssignmentSubmission>
 */
class AssignmentSubmissionFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'assignment_id' => Assignment::factory(),
      'team_id' => Team::factory(),
      'submission_link' => $this->faker->url(),
    ];
  }
}
