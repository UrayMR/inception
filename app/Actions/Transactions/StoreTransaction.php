<?php

namespace App\Actions\Transactions;

use App\DTOs\Transactions\StoreTransactionDTO;
use App\Models\Transaction;
use App\Repositories\Transactions\TransactionRepository;
use App\Services\FileService;

class StoreTransaction
{
  protected string $directory = 'transaction-payment-proofs';
  protected string $disk = 'private';

  public function __construct(
    protected TransactionRepository $transactionRepository,
    protected FileService $fileService,
  ) {}

  public function handle(StoreTransactionDTO $dto): Transaction
  {
    $attributes = [
      'team_id' => $dto->team_id,
      'amount' => $dto->amount,
      'payment_method' => $dto->payment_method,
      'payment_proof_path' => $this->fileService->store(
        $dto->payment_proof_file,
        $this->directory,
        $this->disk
      ),
      'status' => $dto->status,
    ];

    return $this->transactionRepository->store($attributes);
  }
}
