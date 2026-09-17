<?php

namespace App\Repositories\Batches;

use App\Models\RegistrationBatch;

interface RegistrationBatchRepository
{
  public function index(): array;

  public function store(array $attributes): RegistrationBatch;

  public function update(array $attributes, RegistrationBatch $registrationBatch): RegistrationBatch;
}
