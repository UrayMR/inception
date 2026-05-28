<?php

namespace App\Actions\Transactions;

use App\Models\Transaction;
use App\Repositories\Transactions\TransactionRepository;

class DeleteTransaction
{
  public function __construct(
    protected TransactionRepository $transactionRepository,
  ) {}

  public function handle(Transaction $transaction): bool
  {
    return $this->transactionRepository->destroy($transaction);
  }
}
