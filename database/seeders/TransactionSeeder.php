<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    Team::query()
      ->get()
      ->each(function (Team $team) {
        Transaction::factory()
          ->for($team)
          ->create();
      });
  }
}
