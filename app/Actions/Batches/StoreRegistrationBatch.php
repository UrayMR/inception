<?php

namespace App\Actions\Batches;

use App\DTOs\Batches\RegistrationBatchDTO;
use App\Models\RegistrationBatch;
use App\Repositories\Batches\RegistrationBatchRepository;

class StoreRegistrationBatch
{
  public function __construct(
    protected RegistrationBatchRepository $registrationBatchRepository,
  ) {}

  public function handle(RegistrationBatchDTO $dto): RegistrationBatch
  {
    $attributes = [
      'name' => $dto->name,
      'status' => $dto->status,
    ];

    return $this->registrationBatchRepository->store($attributes);
  }
}
