<?php

namespace App\Repositories\Transactions;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentTransactionRepository implements TransactionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
  {
    $query = Transaction::query()->with(['team.competition']);

    if (! empty($queryParams['search'])) {
      $search = $queryParams['search'];
      $query->whereHas('team', function ($q) use ($search) {
        $q->where('team_name', 'like', "%$search%");
      });
    }

    return $query->orderByDesc('created_at')->paginate($perPage);
  }

  public function store(array $attributes): Transaction
  {
    return Transaction::create($attributes);
  }

  public function destroy(Transaction $transaction): bool
  {
    return $transaction->delete();
  }
}
