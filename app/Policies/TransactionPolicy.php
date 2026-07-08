<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
  /**
   * Determine whether the user can view any models.
   */
  public function viewAny(User $user): bool
  {
    return $user->role === UserRole::admin->value || $user->role === UserRole::accountant->value;
  }

  /**
   * Determine whether the user can view the model.
   */
  public function view(User $user, Transaction $transaction): bool
  {
    if (in_array($user->role, [
      UserRole::admin->value,
      UserRole::accountant->value,
    ], true)) {
      return true;
    }

    return $transaction->team?->leader_id === $user->id;
  }

  /**
   * Determine whether the user can create models.
   */
  public function create(User $user): bool
  {
    return $user->role === UserRole::admin->value;
  }

  /**
   * Determine whether the user can update the model.
   */
  public function update(User $user, Transaction $transaction): bool
  {
    return $user->role === UserRole::admin->value || $user->role === UserRole::accountant->value;
  }

  /**
   * Determine whether the user can delete the model.
   */
  public function delete(User $user, Transaction $transaction): bool
  {
    return $user->role === UserRole::admin->value;
  }

  /**
   * Determine whether the user can restore the model.
   */
  public function restore(User $user, Transaction $transaction): bool
  {
    return $user->role === UserRole::admin->value;
  }

  /**
   * Determine whether the user can permanently delete the model.
   */
  public function forceDelete(User $user, Transaction $transaction): bool
  {
    return $user->role === UserRole::admin->value;
  }
}
