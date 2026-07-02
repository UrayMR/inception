<?php

namespace Database\Factories;

use App\Enums\TransactionMethod;
use App\Enums\TransactionStatus;
use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'team_id' => Team::factory(),
      'amount' => $this->faker->randomFloat(2, 10000, 1000000),
      'payment_method' =>  TransactionMethod::qris->value,
      'payment_proof_path' => 'transactions/' . $this->faker->uuid() . '.jpg',
      'status' => $this->faker->randomElement(TransactionStatus::cases()),
    ];
  }
}
