<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\SyncTracker;
use App\Models\User;

class SyncTrackerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::admin->value;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SyncTracker $syncTracker): bool
    {
        return $user->role === UserRole::admin->value;
    }

    /**
     * Determine whether the user can sync transactions to Google Sheet.
     */
    public function syncTransactions(User $user): bool
    {
        return $user->role === UserRole::admin->value;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SyncTracker $syncTracker): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SyncTracker $syncTracker): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SyncTracker $syncTracker): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SyncTracker $syncTracker): bool
    {
        return false;
    }
}
