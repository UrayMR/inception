<?php

namespace App\Services\Competitions;

use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
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
}
