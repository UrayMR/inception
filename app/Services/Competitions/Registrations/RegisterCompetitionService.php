<?php

namespace App\Services\Competitions\Registrations;

use App\Actions\Competitions\Registrations\StoreCompetitionRegistration;
use App\Actions\Competitions\Registrations\UpdateCompetitionRegistration;
use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Exceptions\BusinessException;
use App\Helpers\ThrowException;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RegisterCompetitionService
{
  public function __construct(
    protected StoreCompetitionRegistration $storeCompetitionRegistration,
    protected UpdateCompetitionRegistration $updateCompetitionRegistration,
  ) {}

  public function isCanRegister(): bool
  {
    $userId = Auth::id();

    if (! $userId) {
      return false;
    }

    if (! $this->hasOpenCompetition()) {
      return false;
    }

    return ! $this->hasBlockingRegistration($userId);
  }

  public function register(RegisterCompetitionDTO $dto, Competition $competition): void
  {
    $this->ensureCompetitionIsOpen($competition);
    $this->ensureTeamCompetitionPayloadIsValid($dto, $competition);

    DB::transaction(function () use ($dto, $competition) {
      User::query()->whereKey($dto->leader_id)->lockForUpdate()->first();

      $this->ensureLeaderCanRegister($dto->leader_id);

      $existingRejectedTeam = Team::query()
        ->where('leader_id', $dto->leader_id)
        ->where('competition_id', $competition->id)
        ->where('status', TeamStatus::rejected->value)
        ->lockForUpdate()
        ->first();

      if ($existingRejectedTeam) {
        $this->updateCompetitionRegistration->handle($dto, $competition, $existingRejectedTeam);

        return;
      }

      $this->storeCompetitionRegistration->handle($dto, $competition);
    });
  }

  protected function ensureCompetitionIsOpen(Competition $competition): void
  {
    if ($competition->status === CompetitionStatus::open->value) {
      return;
    }

    ThrowException::validation(
      'competition_id',
      'Registration is only available for competitions with open status.',
    );
  }

  protected function ensureLeaderCanRegister(string $leaderId): void
  {
    if ($this->hasBlockingRegistration($leaderId)) {
      throw new BusinessException(
        'You already have a pending or verified registration.',
      );
    }
  }

  protected function hasOpenCompetition(): bool
  {
    return Competition::query()
      ->where('status', CompetitionStatus::open->value)
      ->exists();
  }

  protected function hasBlockingRegistration(string $leaderId): bool
  {
    return Team::query()
      ->where('leader_id', $leaderId)
      ->whereIn('status', [
        TeamStatus::registered->value,
        TeamStatus::active->value,
      ])
      ->exists();
  }

  protected function ensureTeamCompetitionPayloadIsValid(RegisterCompetitionDTO $dto, Competition $competition): void
  {
    if ($competition->type !== CompetitionType::team->value) {
      return;
    }

    if (! filled($dto->team_name)) {
      ThrowException::validation(
        'team_name',
        'Team name is required for team competitions.',
      );
    }

    if (count($dto->members) < 1) {
      ThrowException::validation(
        'members',
        'At least one team member is required for team competitions.',
      );
    }
  }
}
