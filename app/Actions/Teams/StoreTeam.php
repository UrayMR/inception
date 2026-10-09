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
      'leader_name' => $dto->leader_name,
      'phone_number' => $dto->phone_number,
      'institution' => $dto->institution,
      'requirement_link' => $dto->requirement_link,
      'status' => $dto->status,
    ];

    // $attributes['phone_number'] = $this->parsePhoneNumber($dto->phone_number);
    
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
        'member_phone_number' => $member['member_phone_number'],
      ];
    }, $members);
  }

  /**
   * Parse and format phone number to Indonesian format (62...)
   */
  protected function parsePhoneNumber(string $phoneNumber): ?string
  {
    $cleanNumber = preg_replace('/\D/', '', $phoneNumber);

    if (empty($cleanNumber)) {
      return null;
    }

    if (str_starts_with($cleanNumber, '62')) {
      $cleanNumber = substr($cleanNumber, 2);
    }

    $cleanNumber = ltrim($cleanNumber, '0');

    if (strlen($cleanNumber) < 8) {
      return null;
    }

    return '62' . $cleanNumber;
  }
}
