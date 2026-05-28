<?php

namespace App\Services\Competitions;

use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Utilities\SlugGenerator;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class CompetitionService
{
    public function __construct(
        protected CompetitionRepository $competitionRepository,
    ) {}

    public function index(Request $request, int $perPage = 10): LengthAwarePaginator
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'type' => $request->query('type'),
                // Add more filters if needed
            ],
        ];

        return $this->competitionRepository->index($queryParams, $perPage);
    }

    public function findByIdOrFail(string $id): Competition
    {
        return $this->competitionRepository->findByIdOrFail($id);
    }

    public function getCompetitionMap(array $filters = []): array
    {
        return $this->competitionRepository->getCompetitionMap($filters);
    }

    public function generateUniqueSlug(string $name, ?Competition $ignoreCompetition = null): string
    {
        $baseSlug = SlugGenerator::make($name);
        $slug = $baseSlug;
        $suffix = 2;

        while ($this->competitionRepository->slugExists($slug, $ignoreCompetition?->id)) {
            $slug = sprintf('%s%s%d', $baseSlug, '-', $suffix);
            $suffix++;
        }

        return $slug;
    }
}
