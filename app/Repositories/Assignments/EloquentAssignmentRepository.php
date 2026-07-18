<?php

namespace App\Repositories\Assignments;

use App\Models\Assignment;
use App\Repositories\Assignments\AssignmentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentAssignmentRepository implements AssignmentRepository
{
  /**
   * @param  array  $queryParams  (optional: ['search' => '', 'filters' => ['any' => '', 'any' => '']])
   * @param  int  $perPage  (optional, default 15)
   */
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
  {
    $query = Assignment::query()->with('competition');

    // Searching
    if (! empty($queryParams['search'])) {
      $search = $queryParams['search'];
      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%$search%");
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

  /**
   * @param  array  $attributes  (data sent from form)
   */
  public function store(array $attributes): Assignment
  {
    return Assignment::create($attributes);
  }

  /**
   * @param  array  $attributes  (data sent from form)
   * @param  Assignment  $assignment  (to be updated)
   */
  public function update(array $attributes, Assignment $assignment): Assignment
  {
    $assignment->update($attributes);

    return $assignment;
  }

  /**
   * @param  Assignment  $Assignment  (to be deleted)
   */
  public function destroy(Assignment $Assignment): bool
  {
    return $Assignment->delete();
  }
}
