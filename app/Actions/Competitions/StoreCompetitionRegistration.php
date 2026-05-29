<?php

namespace App\Actions\Competitions;

use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
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

  public function handle(RegisterCompetitionRequest $request, Competition $competition): Team
  {
    $team = $this->teamRepository->store([
      'competition_id' => $competition->id,
      'team_name' => $request->toTeamDTO($competition)->team_name,
      'leader_id' => $request->user()->id,
      'phone_number' => $request->input('phone_number'),
      'institution' => $request->input('institution'),
      'status' => $request->toTeamDTO($competition)->status,
    ]);

    $members = $this->formatMembers($request->input('members', []));

    if (! empty($members)) {
      $this->memberRepository->storeMany($team, $members);
    }

    $this->transactionRepository->store([
      'team_id' => $team->id,
      'amount' => $competition->price,
      'payment_method' => $request->input('payment_method'),
      'payment_proof_path' => $this->fileService->store(
        $request->file('payment_proof_file'),
        $this->directory,
      ),
      'status' => $request->toTransactionDTO($team->id, $competition->price)->status,
    ]);

    return $team;
  }

  protected function formatMembers(array $members): array
  {
    return array_map(function (array $member): array {
      return [
        'member_name' => $member['member_name'],
      ];
    }, $members);
  }
}
