<?php

namespace App\Repositories\Transactions;

use App\Enums\TransactionStatus;
use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentTransactionRepository implements TransactionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
  {
    $query = Transaction::query()
      ->with(['team.competition', 'registrationBatch']);

    if (!empty($queryParams['search'])) {
      $search = $queryParams['search'];

      $query->whereHas('team', function ($q) use ($search) {
        $q->where('team_name', 'like', "%$search%");
      });
    }

    if (!empty($queryParams['filters'])) {
      foreach ($queryParams['filters'] as $key => $value) {
        if ($value !== null && $value !== '') {

          if ($key === 'competition_id') {
            $query->whereHas('team', function ($q) use ($value) {
              $q->where('competition_id', $value);
            });
          } else {
            // else go to transactions table
            $query->where("transactions.{$key}", $value);
          }
        }
      }
    }

    return $query
      ->join(
        'registration_batches',
        'transactions.registration_batch_id',
        '=',
        'registration_batches.id'
      )
      ->join('teams', 'transactions.team_id', '=', 'teams.id')
      ->join('competitions', 'teams.competition_id', '=', 'competitions.id')

      ->orderByRaw("
                CASE
                    WHEN transactions.status = 'pending' THEN 0
                    ELSE 1
                END
            ")
      ->orderByRaw("
                CAST(SUBSTRING(registration_batches.name, 7) AS UNSIGNED) DESC
            ")
      ->orderBy('competitions.name', 'ASC')
      ->orderByDesc('transactions.created_at')

      ->select('transactions.*')
      ->paginate($perPage);
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

  public function hasVerifiedTransaction(Team $team): bool
  {
    return $team->transactions()
      ->where('status', TransactionStatus::verified->value)
      ->exists();
  }
}
