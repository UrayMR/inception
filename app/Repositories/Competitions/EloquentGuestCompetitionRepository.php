<?php

namespace App\Repositories\Competitions;

use App\Enums\CompetitionStatus;
use App\Models\Competition;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentGuestCompetitionRepository implements GuestCompetitionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
  {
    $query = Competition::query()->withMin('timelines', 'start_at');

    if (! empty($queryParams['search'])) {
      $search = $queryParams['search'];

      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%{$search}%");
      });
    }

    return $query
      ->orderByRaw("CASE WHEN name = 'Hackathon' THEN 0 ELSE 1 END")
      ->orderByRaw('CASE WHEN status = ? THEN 0 ELSE 1 END', [CompetitionStatus::open->value])
      ->orderByRaw('CASE WHEN timelines_min_start_at IS NULL THEN 1 ELSE 0 END')
      ->orderBy('timelines_min_start_at')
      ->orderBy('name')
      ->paginate($perPage);
  }

  public function getFeaturedForHome(): Collection
  {
    return Competition::query()
      ->orderByRaw("CASE WHEN name = 'Hackathon' THEN 0 ELSE 1 END")
      ->orderByDesc('status')
      ->get(['id', 'name', 'slug', 'description', 'status']);
  }
}
