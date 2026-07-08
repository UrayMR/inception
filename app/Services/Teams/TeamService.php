<?php

namespace App\Services\Teams;

use App\Actions\Teams\StoreTeam;
use App\Actions\Teams\DeleteTeam;
use App\Actions\Teams\UpdateTeam;
use App\DTOs\Teams\StoreTeamDTO;
use App\DTOs\Teams\UpdateTeamDTO;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use App\Services\Competitions\CompetitionService;
use Illuminate\Support\Facades\DB;

class TeamService
{
    public function __construct(
        protected TeamRepository $teamRepository,
        protected CompetitionService $competitionService,
        protected StoreTeam $storeTeam,
        protected UpdateTeam $updateTeam,
        protected DeleteTeam $deleteTeam,
    ) {}

    public function index(array $queryParams)
    {
        // Only allow specific query params
        $cleanParams = [
            'search' => $queryParams['search'] ?? null,
            'filters' => [
                'type' => $queryParams['filters']['type'] ?? null,
                // Add more filters if needed
            ],
        ];

        return $this->teamRepository->index($cleanParams);
    }

    public function store(StoreTeamDTO $dto, array $members = [])
    {
        $this->competitionService->ensureTeamCompetitionPayloadIsValid($dto->competition_id, $members);

        return DB::transaction(function () use ($dto, $members) {
            return $this->storeTeam->handle($dto, $members);
        });
    }

    public function update(UpdateTeamDTO $dto, Team $team, array $members = []): Team
    {
        $this->competitionService->ensureTeamCompetitionPayloadIsValid($dto->competition_id, $members);

        return DB::transaction(function () use ($dto, $team, $members) {
            return $this->updateTeam->handle($dto, $team, $members);
        });
    }

    public function destroy(Team $team): bool
    {
        return DB::transaction(function () use ($team) {
            return $this->deleteTeam->handle($team);
        });
    }
}
