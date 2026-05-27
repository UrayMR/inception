<?php

namespace App\Actions\Teams;

use App\Enums\CompetitionType;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use App\Services\Teams\MemberService;
use Illuminate\Support\Facades\DB;

class DeleteTeam
{
  public function __construct(
    protected TeamRepository $teamRepository,
    protected MemberService $memberService,
  ) {}

  public function handle(Team $team): bool
  {
    return DB::transaction(function () use ($team) {
      $team->loadMissing('competition');

      if ($team->competition?->type === CompetitionType::team->value) {
        $isMemberDeleted = $this->memberService->destroyMany($team);

        if (! $isMemberDeleted) {
          return false;
        }
      }

      return $this->teamRepository->destroy($team);
    });
  }
}
