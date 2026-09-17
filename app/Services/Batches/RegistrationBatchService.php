<?php

namespace App\Services\Batches;

use App\Repositories\Batches\RegistrationBatchRepository;
use App\Actions\Batches\StoreRegistrationBatch;
use App\Actions\Batches\UpdateRegistrationBatch;
use App\DTOs\Batches\RegistrationBatchDTO;
use App\Enums\RegistrationBatchStatus;
use App\Exceptions\BusinessException;
use App\Helpers\ThrowException;
use Illuminate\Support\Facades\DB;
use App\Models\RegistrationBatch;

class RegistrationBatchService
{
  public function __construct(
    protected RegistrationBatchRepository $registrationBatchRepository,
    protected StoreRegistrationBatch $storeRegistrationBatch,
    protected UpdateRegistrationBatch $updateRegistrationBatch,
  ) {}

  public function index()
  {
    return $this->registrationBatchRepository->index();
  }

  public function store(RegistrationBatchDTO $dto)
  {
    DB::transaction(function () use ($dto) {
      $this->storeRegistrationBatch->handle($dto);
    });
  }

  public function update(RegistrationBatchDTO $dto, RegistrationBatch $registrationBatch)
  {
    DB::transaction(function () use ($dto, $registrationBatch) {
      $this->updateRegistrationBatch->handle($dto, $registrationBatch);
    });
  }

  public function checkActiveBatch()
  {
    $activeBatch = RegistrationBatch::where('status', RegistrationBatchStatus::active->value)->first();
    return $activeBatch;
  }

  public function switch(RegistrationBatch $registrationBatch)
  {
    DB::transaction(function () use ($registrationBatch) {
      $activeBatch = $this->checkActiveBatch();

      if ($activeBatch?->id === $registrationBatch->id) {
        return;
      }

      if ($activeBatch) {
        $this->updateRegistrationBatch->handle(
          new RegistrationBatchDTO($activeBatch->name, RegistrationBatchStatus::inactive->value),
          $activeBatch,
        );
      }

      $this->updateRegistrationBatch->handle(
        new RegistrationBatchDTO($registrationBatch->name, RegistrationBatchStatus::active->value),
        $registrationBatch,
      );
    });
  }
}
