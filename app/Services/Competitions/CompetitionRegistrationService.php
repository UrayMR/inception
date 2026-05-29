<?php

namespace App\Services\Competitions;

use App\Actions\Competitions\StoreCompetitionRegistration;
use App\Actions\Competitions\UpdateCompetitionRegistration;
use App\Enums\CompetitionStatus;
use App\Enums\TeamStatus;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use App\Helpers\ThrowException;
use Illuminate\Support\Facades\DB;

class CompetitionRegistrationService
{
  public function __construct(
    protected StoreCompetitionRegistration $storeCompetitionRegistration,
    protected UpdateCompetitionRegistration $updateCompetitionRegistration,
  ) {}

  public function register(RegisterCompetitionRequest $request, Competition $competition): void
  {
    $this->ensureCompetitionIsOpen($competition);

    DB::transaction(function () use ($request, $competition) {
      // Lock user row to serialize concurrent registration attempts by the same leader.
      User::query()->whereKey($request->user()->id)->lockForUpdate()->first();

      $this->ensureLeaderCanRegister($request);

      // If there's an existing rejected team for this leader and competition, update it instead of creating a new one.
      $existingRejectedTeam = Team::query()
        ->where('leader_id', $request->user()->id)
        ->where('competition_id', $competition->id)
        ->where('status', TeamStatus::rejected->value)
        ->lockForUpdate()
        ->first();

      if ($existingRejectedTeam) {
        $this->updateCompetitionRegistration->handle($request, $competition, $existingRejectedTeam);
      } else {
        $this->storeCompetitionRegistration->handle($request, $competition);
      }
    });
  }

  protected function ensureLeaderCanRegister(RegisterCompetitionRequest $request): void
  {
    // Check if the user already has an active or registered team for any competition.
    $hasActiveRegistration = Team::query()
      ->where('leader_id', $request->user()->id)
      ->whereIn('status', [
        TeamStatus::active->value,
        TeamStatus::registered->value,
      ])
      ->exists();

    if ($hasActiveRegistration) {
      ThrowException::validation(
        'competition_id',
        'You already have a pending or verified registration.',
      );
    }
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
}
