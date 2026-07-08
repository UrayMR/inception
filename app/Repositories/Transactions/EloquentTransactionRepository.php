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

    if (! empty($queryParams['filters'])) {
      foreach ($queryParams['filters'] as $key => $value) {
        if ($value !== null && $value !== '') {
          $query->where($key, $value);
        }
      }
    }

    return $query->orderByDesc('created_at')->paginate($perPage);
  }

  public function store(array $attributes): Transaction
  {
    return Transaction::create($attributes);
  }

  public function update(array $attributes, Transaction $transaction): Transaction
  {
    $transaction->update($attributes);

    return $transaction;
  }

  public function destroy(Transaction $transaction): bool
  {
    return $transaction->delete();
  }
}
