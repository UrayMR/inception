<?php

namespace App\Services\Transactions;

use App\Repositories\Transactions\TransactionRepository;
use Illuminate\Http\Request;
use App\Actions\Transactions\VerifyTransaction;
use App\Actions\Transactions\RejectTransaction;
use App\Actions\Transactions\DeleteTransaction;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;

class TransactionService
{
  public function __construct(
    protected TransactionRepository $transactionRepository,
    protected VerifyTransaction $verifyTransaction,
    protected RejectTransaction $rejectTransaction,
    protected DeleteTransaction $deleteTransaction,
  ) {}

  public function index(array $queryParams)
  {
    $cleanParams = [
      'search'  => $queryParams['search'] ?? null,
      'filters' => [
        'status' => $queryParams['filters']['status'] ?? null,
      ],
    ];

    return $this->transactionRepository->index($cleanParams);
  }

  public function verify(Transaction $transaction): Transaction
  {
    return DB::transaction(function () use ($transaction) {
      return $this->verifyTransaction->handle($transaction);
    });
  }

  public function reject(Transaction $transaction): Transaction
  {
    return DB::transaction(function () use ($transaction) {
      return $this->rejectTransaction->handle($transaction);
    });
  }

  public function destroy(Transaction $transaction): bool
  {
    return DB::transaction(function () use ($transaction) {
      return $this->deleteTransaction->handle($transaction);
    });
  }
}
