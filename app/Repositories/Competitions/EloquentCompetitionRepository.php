<?php

namespace App\Repositories\Competitions;

use App\Models\Competition;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCompetitionRepository implements CompetitionRepository
{
    /**
     * @param  array  $queryParams  (optional: ['search' => '', 'filters' => ['any' => '', 'any' => '']])
     * @param  int  $perPage  (optional, default 15)
     */
    public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Competition::query()->with('timelines');

        // Searching
        if (! empty($queryParams['search'])) {
            $search = $queryParams['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        return $query->orderByDesc('updated_at')->paginate($perPage);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     */
    public function store(array $attributes): Competition
    {
        return Competition::create($attributes);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     * @param  Competition  $competition  (to be updated)
     */
    public function update(array $attributes, Competition $competition): Competition
    {
        $competition->update($attributes);

        return $competition;
    }

    /**
     * @param  Competition  $competition  (to be deleted)
     */
    public function destroy(Competition $competition): bool
    {
        return $competition->delete();
    }

    public function getCompetitionMap(): array
    {
        return Competition::select('id', 'name', 'type')
            ->get()
            ->map(function ($competition) {
                return [
                    'value' => $competition->id,
                    'label' => $competition->name,
                    'otherValues' => [
                        'type' => $competition->type,
                    ],
                ];
            })
            ->toArray();
    }
}
