<?php

namespace App\Actions\Users;

use App\Models\User;

/**
 * Commit an user to manage a competition or remove them from managing any competitions.
 */
class ManageUserCompetition
{
  public function handle(User $user, ?string $competitionId = null): void
  {
    if ($competitionId) {
      $user->managedCompetitions()->sync([$competitionId]);
    } else {
      $user->managedCompetitions()->detach();
    }
  }
}
