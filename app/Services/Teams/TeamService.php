<?php

namespace App\Services\Teams;

use App\DTOs\Teams\StoreTeamDTO;
use App\DTOs\Teams\UpdateTeamDTO;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use Illuminate\Http\Request;

class TeamService
{
    // NOTE:
    // TeamService can be reusable accross different role controllers (Admin, Participant, etc.)
    // Just called the function when trying to perform team related operations, and the service will handle the rest

    // Example:
    // in TeamController.php (admin controller), we can call $this->teamService->create($dto) to create a team.
    // in Participant/ParticipantTeamController.php (participant controller), we can also call $this->teamService->create($dto) to create a team.

    public function __construct(
        protected TeamRepository $teamRepository,
    ) {}

    public function index(Request $request)
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'type' => $request->query('type'),
                // Add more filters if needed
            ],
        ];

        return $this->teamRepository->index($queryParams);
    }

    public function create(StoreTeamDTO $dto): Team
    {
        $attributes = [
            'competition_id' => $dto->competition_id,
            'team_name' => $dto->team_name,
            'leader_id' => $dto->leader_id,
            'phone_number' => $dto->phone_number,
        ];

        return $this->teamRepository->store($attributes);
    }

    public function update(UpdateTeamDTO $dto, Team $team): Team
    {
        $attributes = [
            'competition_id' => $dto->competition_id,
            'team_name' => $dto->team_name,
            'phone_number' => $dto->phone_number,
        ];

        return $this->teamRepository->update($attributes, $team);
    }

    public function destroy(Team $team): bool
    {
        return $this->teamRepository->destroy($team);
    }
}
