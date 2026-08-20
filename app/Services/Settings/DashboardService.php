<?php

namespace App\Services\Settings;

use App\Models\Team;
use App\Models\Assignment;

class DashboardService
{
  public function getDashboardData(?Team $team): array
  {
    $competition = $team?->competition;

    if (! $competition) {
      return [
        'competition' => null,
        'schedule' => [],
        'transaction' => null,
        'assignments' => collect(),
      ];
    }

    $assignments = Assignment::query()
      ->where('competition_id', $competition->id)
      ->with([
        'competition',
        'submission' => function ($query) use ($team) {
          $query->where('team_id', $team?->id);
        },
      ])
      ->orderBy('due_at')
      ->get();

    return [
      'competition' => $competition,
      'schedule' => $competition->timelines,
      'transaction' => $team?->transactions()->latest()->first(),
      'assignments' => $assignments,
    ];
  }
}
