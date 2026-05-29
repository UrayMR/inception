<?php

namespace App\Actions\Competitions\Registrations;

use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Models\Competition;
use App\Models\Team;
use App\Repositories\Teams\Members\MemberRepository;
use App\Repositories\Teams\TeamRepository;
use App\Repositories\Transactions\TransactionRepository;
use App\Services\FileService;

class StoreCompetitionRegistration
{
  protected string $directory = 'transaction-payment-proofs';

  public function __construct(
    protected TeamRepository $teamRepository,
    protected MemberRepository $memberRepository,
    protected TransactionRepository $transactionRepository,
    protected FileService $fileService,
  ) {}

  public function handle(RegisterCompetitionDTO $dto, Competition $competition): Team
  {
    $teamDTO = $dto->toTeamDTO($competition);

    $team = $this->teamRepository->store([
      'competition_id' => $competition->id,
      'team_name' => $teamDTO->team_name,
      'leader_id' => $teamDTO->leader_id,
      'phone_number' => $teamDTO->phone_number,
      'institution' => $teamDTO->institution,
      'status' => $teamDTO->status,
    ]);

    $members = $dto->memberRows();

    if (! empty($members)) {
      $this->memberRepository->storeMany($team, $members);
    }

    $transactionDTO = $dto->toTransactionDTO($team->id, $competition->price);

    $this->transactionRepository->store([
      'team_id' => $team->id,
      'amount' => $competition->price,
      'payment_method' => $transactionDTO->payment_method,
      'payment_proof_path' => $this->fileService->store(
        $transactionDTO->payment_proof_file,
        $this->directory,
      ),
      'status' => $transactionDTO->status,
    ]);

    return $team;
  }
}
