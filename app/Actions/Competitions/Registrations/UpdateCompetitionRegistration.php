<?php

namespace App\Actions\Competitions\Registrations;

use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Repositories\Teams\Members\MemberRepository;
use App\Repositories\Teams\TeamRepository;
use App\Repositories\Transactions\TransactionRepository;
use App\Services\FileService;

class UpdateCompetitionRegistration
{
  protected string $directory = 'transaction-payment-proofs';

  public function __construct(
    protected TeamRepository $teamRepository,
    protected MemberRepository $memberRepository,
    protected TransactionRepository $transactionRepository,
    protected FileService $fileService,
  ) {}

  public function handle(RegisterCompetitionDTO $dto, Competition $competition, Team $team): Team
  {
    $teamDTO = $dto->toTeamDTO($competition);

    $updatedTeam = $this->teamRepository->update([
      'competition_id' => $competition->id,
      'team_name' => $teamDTO->team_name,
      'leader_id' => $teamDTO->leader_id,
      'phone_number' => $teamDTO->phone_number,
      'institution' => $teamDTO->institution,
      'status' => TeamStatus::active->value,
    ], $team);

    $members = $dto->memberRows();

    if (! empty($members)) {
      $this->memberRepository->updateMany($updatedTeam, $members);
    }

    $transactionDTO = $dto->toTransactionDTO($updatedTeam->id, $competition->price);

    $this->transactionRepository->store([
      'team_id' => $updatedTeam->id,
      'amount' => $competition->price,
      'payment_method' => $transactionDTO->payment_method,
      'payment_proof_path' => $this->fileService->store(
        $transactionDTO->payment_proof_file,
        $this->directory,
      ),
      'status' => $transactionDTO->status,
    ]);

    return $updatedTeam;
  }
}
