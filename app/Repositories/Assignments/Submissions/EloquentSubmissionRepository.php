<?php

namespace App\Repositories\Assignments\Submissions;

use App\Models\AssignmentSubmission;
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
        if ($value !== null && $value !== '') {
          $query->where($key, $value);
        }
      }
    }

    return $query->orderByDesc('updated_at')->paginate($perPage);
  }
}
