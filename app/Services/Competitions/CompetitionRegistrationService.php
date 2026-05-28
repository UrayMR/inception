<?php

namespace App\Services\Competitions;

use App\Actions\Teams\StoreTeam;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use App\Services\Transactions\TransactionService;
use Illuminate\Support\Facades\DB;

class CompetitionRegistrationService
{
  public function __construct(
    protected StoreTeam $storeTeam,
    protected TransactionService $transactionService,
  ) {}

  public function register(RegisterCompetitionRequest $request, Competition $competition): void
  {
    DB::transaction(function () use ($request, $competition) {
      $team = $this->storeTeam->handle(
        $request->toTeamDTO($competition),
        $request->input('members', []),
      );

      $this->transactionService->create($request->toTransactionDTO($team->id, $competition->price));
    });
  }
}
