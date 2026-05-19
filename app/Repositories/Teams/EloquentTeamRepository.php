<?php

namespace App\Repositories\Teams;

use App\Models\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentTeamRepository implements TeamRepository
{
    /**
     * @param  array  $queryParams  (optional: ['search' => '', 'filters' => ['any' => '', 'any' => '']])
     * @param  int  $perPage  (optional, default 15)
     */
    public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Team::query()->with(['competition', 'leader']);

        // Searching
        if (! empty($queryParams['search'])) {
            $search = $queryParams['search'];
            $query->where(function ($q) use ($search) {
                $q->where('team_name', 'like', "%$search%");
            });
        }

        return $query->orderByDesc('updated_at')->paginate($perPage);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     */
    public function store(array $attributes): Team
    {
        return Team::create($attributes);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     * @param  Team  $team  (to be updated)
     */
    public function update(array $attributes, Team $team): Team
    {
        $team->update($attributes);

        return $team;
    }

    /**
     * @param  Team  $team  (to be deleted)
     */
    public function destroy(Team $team): bool
    {
        return $team->delete();
    }
}
