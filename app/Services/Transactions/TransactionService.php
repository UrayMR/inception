<?php

namespace App\Services\Transactions;

use App\DTOs\Transactions\StoreTransactionDTO;
use App\Models\Transaction;
use App\Repositories\Transactions\TransactionRepository;
use Illuminate\Http\Request;

class TransactionService
{
  public function __construct(
    protected TransactionRepository $transactionRepository,
  ) {}

  public function index(Request $request)
  {
    $queryParams = [
      'search' => $request->query('search'),
      'filters' => [
        'status' => $request->query('status'),
      ],
    ];

    return $this->transactionRepository->index($queryParams);
  }

  public function create(StoreTransactionDTO $dto): Transaction
  {
    $attributes = [
      'team_id' => $dto->team_id,
      'amount' => $dto->amount,
      'payment_method' => $dto->payment_method,
      'payment_proof_file' => $dto->payment_proof_file,
      'status' => $dto->status,
    ];

    return $this->transactionRepository->store($attributes);
  }

  public function destroy(Transaction $transaction): bool
  {
    return $this->transactionRepository->destroy($transaction);
  }
}
