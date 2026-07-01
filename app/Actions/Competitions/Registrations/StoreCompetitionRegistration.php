<?php

namespace App\Actions\Competitions\Registrations;

use App\Actions\Teams\StoreTeam;
use App\Actions\Transactions\StoreTransaction;
use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Models\Competition;
use App\Models\Team;

class StoreCompetitionRegistration
{
  public function __construct(
    protected StoreTeam $storeTeam,
    protected StoreTransaction $storeTransaction,
  ) {}

  public function handle(RegisterCompetitionDTO $dto, Competition $competition): Team
  {
    $teamDTO = $dto->toStoreTeamDTO($competition);

    $team = $this->storeTeam->handle($teamDTO, $dto->members);

    $transactionDTO = $dto->toTransactionDTO($team->id, $competition->price);

    $this->storeTransaction->handle($transactionDTO);

    return $team;
  }
}
