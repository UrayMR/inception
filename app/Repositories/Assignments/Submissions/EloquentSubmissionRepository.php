<?php

namespace App\Repositories\Assignments\Submissions;

use App\Models\AssignmentSubmission;
use App\Models\Assignment;
use App\Models\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentSubmissionRepository implements SubmissionRepository
{
  /**
   * @param  array  $queryParams  (optional: ['search' => '', 'filters' => ['any' => '', 'any' => '']])
   * @param  int  $perPage  (optional, default 15)
   */
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
  {
    $query = AssignmentSubmission::query()->with(['assignment.competition', 'team']);

    // Searching
    if (! empty($queryParams['search'])) {
      $search = $queryParams['search'];
      $query->where(function ($q) use ($search) {
        $q->orWhereHas('team', function ($uq) use ($search) {
          $uq->where('team_name', 'like', "%{$search}%");
        });
      });
    }

    if (! empty($queryParams['filters'])) {
      foreach ($queryParams['filters'] as $key => $value) {
        if ($key === 'competition_ids') {
          if (is_array($value) && empty($value)) {
            $query->whereRaw('0 = 1');

            continue;
          }

          if (is_array($value) && ! empty($value)) {
            $query->whereIn('assignment_id', function ($subQuery) use ($value) {
              $subQuery->select('id')
                ->from('assignments')
                ->whereIn('competition_id', $value);
            });

            continue;
          }
        }

        if ($value !== null && $value !== '') {
          $query->where($key, $value);
        }
      }
    }

    return $query->orderByDesc('updated_at')->paginate($perPage);
  }

  /**
   * @param  Team  $team  (to be updated)
   * @param  Assignment  $assignment  (to be updated)
   * @param  string  $submissionLink  (to be updated)
   */
  public function upsertForTeamAssignment(Team $team, Assignment $assignment, string $submissionLink): void
  {
    AssignmentSubmission::query()->updateOrCreate(
      [
        'assignment_id' => $assignment->id,
        'team_id' => $team->id,
      ],
      [
        'submission_link' => $submissionLink,
      ]
    );
  }
}
