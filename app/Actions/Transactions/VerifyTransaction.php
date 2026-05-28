<?php

namespace App\Actions\Transactions;

use App\Enums\TeamStatus;
use App\Enums\TransactionStatus;
use App\Models\Transaction;
use App\Repositories\Teams\TeamRepository;
use App\Repositories\Transactions\TransactionRepository;
use Illuminate\Support\Facades\DB;

class VerifyTransaction
{
  public function __construct(
    protected TransactionRepository $transactionRepository,
    protected TeamRepository $teamRepository,
  ) {}

  public function handle(Transaction $transaction): Transaction
  {
    return DB::transaction(function () use ($transaction) {
      $updatedTransaction = $this->transactionRepository->update([
        'status' => TransactionStatus::verified->value,
      ], $transaction);

      $this->teamRepository->update([
        'status' => TeamStatus::registered->value,
      ], $updatedTransaction->team);

      return $updatedTransaction;
    });
  }
}
