<?php

namespace App\Actions\Teams;

use App\DTOs\Teams\StoreTeamDTO;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use App\Services\Teams\MemberService;

class StoreTeam
{
  public function __construct(
    protected TeamRepository $teamRepository,
    protected MemberService $memberService,
  ) {}

  public function handle(StoreTeamDTO $dto, array $members = []): Team
  {
    $attributes = [
      'competition_id' => $dto->competition_id,
      'team_name' => $dto->team_name,
      'leader_id' => $dto->leader_id,
      'phone_number' => $dto->phone_number,
      'institution' => $dto->institution,
      'requirement_link' => $dto->requirement_link,
      'status' => $dto->status,
    ];

    $team = $this->teamRepository->store($attributes);

    if (! empty($members)) {
      $this->memberService->createMany($team, $this->formatMembers($members));
    }

    return $team;
  }

  protected function formatMembers(array $members): array
  {
    return array_map(function (array $member): array {
      return [
        'member_name' => $member['member_name'],
      ];
    }, $members);
  }
}
