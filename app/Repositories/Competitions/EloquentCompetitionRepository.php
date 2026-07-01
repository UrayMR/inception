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

    public function findByIdOrFail(string $id): Competition
    {
        return Competition::query()->findOrFail($id);
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

    public function getCompetitionMap(array $filters = []): array
    {
        $query = Competition::query();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // TODO: FIX THIS HELLA BAD CODE, THIS IS NOT A GOOD PRACTICE, SHOULD BE REFACTORED
        return $query
            ->with('timelines')
            ->get()
            ->map(function ($competition) {
                return [
                    'value' => $competition->id,
                    'label' => $competition->name,
                    'otherValues' => [
                        'status' => $competition->status,
                        'slug' => $competition->slug,
                        'type' => $competition->type,
                        'price' => $competition->price,
                        'max_member' => $competition->max_member,
                        'timelines' => $competition->timelines->toArray(),
                    ],
                ];
            })
            ->toArray();
    }

    public function slugExists(string $slug, ?string $ignoreCompetitionId = null): bool
    {
        return Competition::query()
            ->where('slug', $slug)
            ->when($ignoreCompetitionId, function ($query, string $ignoreCompetitionId) {
                $query->where('id', '!=', $ignoreCompetitionId);
            })
            ->exists();
    }
}
