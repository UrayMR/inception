<?php

namespace App\Services\Competitions;

use App\Enums\CompetitionType;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use App\Services\Teams\MemberService;
use App\Services\Teams\TeamService;
use App\Services\Transactions\TransactionService;
use Illuminate\Support\Facades\DB;

class CompetitionRegistrationService
{
  public function __construct(
    protected TeamService $teamService,
    protected MemberService $memberService,
    protected TransactionService $transactionService,
  ) {}

  public function register(RegisterCompetitionRequest $request, Competition $competition): void
  {
    DB::transaction(function () use ($request, $competition) {
      $team = $this->teamService->create($request->toTeamDTO($competition));

      if ($competition->type === CompetitionType::team->value) {
        $this->memberService->createMany($team, $request->toMemberDTO($team->id));
      }

      $this->transactionService->create($request->toTransactionDTO($team->id, $competition->price));
    });
  }
}
