<?php

namespace App\Services\Competitions;

use App\Actions\Transactions\StoreTransaction;
use App\Actions\Teams\StoreTeam;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use Illuminate\Support\Facades\DB;

class CompetitionRegistrationService
{
  public function __construct(
    protected StoreTeam $storeTeam,
    protected StoreTransaction $storeTransaction,
  ) {}

  public function register(RegisterCompetitionRequest $request, Competition $competition): void
  {
    DB::transaction(function () use ($request, $competition) {
      $team = $this->storeTeam->handle(
        $request->toTeamDTO($competition),
        $request->input('members', []),
      );

      $this->storeTransaction->handle($request->toTransactionDTO($team->id, $competition->price));
    });
  }
}
