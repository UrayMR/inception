<?php

namespace App\DTOs\Competitions\Registrations;

use App\DTOs\Teams\StoreTeamDTO;
use App\DTOs\Transactions\StoreTransactionDTO;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Enums\TransactionStatus;
use App\Models\Competition;
use Illuminate\Http\UploadedFile;

class RegisterCompetitionDTO
{
  public function __construct(
    public string $competition_id,
    public ?string $team_name,
    public string $leader_id,
    public string $leader_name,
    public string $phone_number,
    public ?string $institution,
    public string $payment_method,
    public UploadedFile $payment_proof_file,
    public array $members = [],
  ) {}

  public function teamNameFor(Competition $competition): string
  {
    return $competition->type === CompetitionType::solo->value
      ? $this->leader_name
      : trim((string) $this->team_name);
  }

  public function toTeamDTO(Competition $competition): StoreTeamDTO
  {
    return new StoreTeamDTO(
      competition_id: $competition->id,
      team_name: $this->teamNameFor($competition),
      leader_id: $this->leader_id,
      phone_number: $this->phone_number,
      institution: $this->institution,
      status: TeamStatus::active->value,
    );
  }

  public function toTransactionDTO(string $teamId, float $amount): StoreTransactionDTO
  {
    return new StoreTransactionDTO(
      team_id: $teamId,
      amount: $amount,
      payment_method: $this->payment_method,
      payment_proof_file: $this->payment_proof_file,
      status: TransactionStatus::pending->value,
    );
  }

  public function memberRows(): array
  {
    return array_map(function (array $member): array {
      return [
        'member_name' => $member['member_name'],
      ];
    }, $this->members);
  }
}
