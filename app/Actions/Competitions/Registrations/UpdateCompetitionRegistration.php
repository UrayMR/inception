<?php

namespace App\Actions\Competitions\Registrations;

use App\Actions\Teams\UpdateTeam;
use App\Actions\Transactions\StoreTransaction;
use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Models\Competition;
use App\Models\Team;
use App\Services\FileService;

class UpdateCompetitionRegistration
{
  public function __construct(
    protected UpdateTeam $updateTeam,
    protected StoreTransaction $storeTransaction,
    protected FileService $fileService,
  ) {}

  public function handle(RegisterCompetitionDTO $dto, Competition $competition, Team $team, string $registrationBatchId): Team
  {
    $teamDTO = $dto->toUpdateTeamDTO($competition);

    $updatedTeam = $this->updateTeam->handle($teamDTO, $team);

    $transactionDTO = $dto->toTransactionDTO($updatedTeam->id, $competition->price, $registrationBatchId);

    $this->storeTransaction->handle($transactionDTO);

    return $updatedTeam;
  }
}
