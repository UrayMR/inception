<?php

namespace App\Services\Transactions;

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
}
