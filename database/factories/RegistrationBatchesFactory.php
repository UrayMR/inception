<?php

namespace Database\Factories;

use App\Enums\RegistrationBatchStatus;
use App\Enums\RegistrationBatchType;
use App\Models\RegistrationBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RegistrationBatch>
 */
class RegistrationBatchesFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'name' => $this->faker->randomElement(RegistrationBatchType::cases()),
      'status' => $this->faker->randomElement(RegistrationBatchStatus::cases()),
    ];
  }
}
