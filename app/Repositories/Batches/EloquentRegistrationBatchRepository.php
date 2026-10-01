<?php

namespace App\Repositories\Batches;

use App\Models\RegistrationBatch;
use App\Repositories\Batches\RegistrationBatchRepository;

class EloquentRegistrationBatchRepository implements RegistrationBatchRepository
{
  public function index(): array
  {
    $query = RegistrationBatch::get();

    return $query->toArray();
  }

  /**
   * @param  array  $attributes  (data sent from form)
   */
  public function store(array $attributes): RegistrationBatch
  {
    return RegistrationBatch::create($attributes);
  }

  /**
   * @param  array  $attributes  (data sent from form)
   * @param  RegistrationBatch  $registrationBatch  (to be updated)
   */
  public function update(array $attributes, RegistrationBatch $registrationBatch): RegistrationBatch
  {
    $registrationBatch->update($attributes);

    return $registrationBatch;
  }
}
