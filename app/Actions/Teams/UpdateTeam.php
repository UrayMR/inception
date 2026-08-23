<?php

namespace App\Actions\Teams;

use App\DTOs\Teams\UpdateTeamDTO;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use App\Services\Teams\MemberService;

class UpdateTeam
{
  public function __construct(
    protected TeamRepository $teamRepository,
    protected MemberService $memberService,
  ) {}

  public function handle(UpdateTeamDTO $dto, Team $team, array $members = []): Team
  {
    $attributes = [
      'competition_id' => $dto->competition_id,
      'team_name' => $dto->team_name,
      'leader_name' => $dto->leader_name,
      'phone_number' => $dto->phone_number,
      'institution' => $dto->institution,
      'requirement_link' => $dto->requirement_link,
      'status' => $dto->status,
    ];

    $updatedTeam = $this->teamRepository->update($attributes, $team);

    if (! empty($members)) {
      $this->memberService->updateMany($updatedTeam, $this->formatMembers($members));
    }

    return $updatedTeam;
  }

  protected function formatMembers(array $members): array
  {
    return array_map(function (array $member): array {
      return [
        'member_name' => $member['member_name'],
        'member_phone_number' => $member['member_phone_number'],
      ];
    }, $members);
  }
}
