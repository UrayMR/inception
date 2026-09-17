<?php

namespace Database\Seeders;

use App\Enums\RegistrationBatchStatus;
use App\Enums\RegistrationBatchType;
use App\Models\RegistrationBatch;
use Illuminate\Database\Seeder;

class RegistrationBatchSeeder extends Seeder
{
  public function run(): void
  {
    RegistrationBatch::updateOrCreate([
      'name' => RegistrationBatchType::batch1->value,
    ], [
      'name' => RegistrationBatchType::batch1->value,
      'status' => RegistrationBatchStatus::active->value,
    ]);

    RegistrationBatch::updateOrCreate([
      'name' => RegistrationBatchType::batch2->value,
    ], [
      'name' => RegistrationBatchType::batch2->value,
      'status' => RegistrationBatchStatus::inactive->value,
    ]);
  }
}
