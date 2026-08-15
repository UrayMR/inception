<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Team;
use App\Resources\Assignments\UserAssignmentSubmissionResource;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class DashboardController extends Controller
{
  public function getDashboardData(?Team $team): array
  {
    $competition = $team?->competition;

    if (!$competition) {
      return [
        'competition' => null,
        'schedule' => [],
        'transaction' => null,
        'assignments' => null,
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

  public function index(): Response
  {
    $user = Auth::user();
    $data = $this->getDashboardData($user?->team);

    return $this->render('settings/dashboard', [
      'competition' => $data['competition'],
      'schedule' => $data['schedule'],
      'transaction' => $data['transaction'],
      'assignments' => UserAssignmentSubmissionResource::collection($data['assignments'])->resolve(),
    ]);
  }
}
