<?php

namespace App\Repositories\Transactions;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TransactionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

  public function store(array $attributes): Transaction;

  public function destroy(Transaction $transaction): bool;
}
