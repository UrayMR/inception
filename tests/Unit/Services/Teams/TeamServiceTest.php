<?php

namespace Tests\Unit\Services\Teams;

use App\Actions\Teams\DeleteTeam;
use App\Actions\Teams\StoreTeam;
use App\Actions\Teams\UpdateTeam;
use App\DTOs\Teams\StoreTeamDTO;
use App\Enums\TeamStatus;
use App\Models\Team;
use App\Repositories\Teams\TeamRepository;
use App\Services\Competitions\CompetitionService;
use App\Services\Teams\TeamService;
use Mockery;
use Tests\TestCase;

class TeamServiceTest extends TestCase
{
  public function tearDown(): void
  {
    Mockery::close();

    parent::tearDown();
  }

  public function test_store_delegates_to_competition_service_and_store_action(): void
  {
    // Arrange
    $competitionService = Mockery::mock(CompetitionService::class);
    $storeTeam = Mockery::mock(StoreTeam::class);
    $teamRepository = Mockery::mock(TeamRepository::class);

    $dto = new StoreTeamDTO(
      competition_id: 'comp-id',
      team_name: 'Alpha',
      leader_id: 'leader-id',
      phone_number: '0812',
      institution: null,
      status: TeamStatus::active->value,
    );

    $members = [['member_name' => 'A']];

    $competitionService->shouldReceive('ensureTeamCompetitionPayloadIsValid')->once()->with('comp-id', $members);

    $storeTeam->shouldReceive('handle')->once()->withArgs(function ($argDto, $argMembers) use ($dto, $members) {
      return $argDto === $dto && $argMembers === $members;
    })->andReturn(new Team());

    $service = app(TeamService::class);

    // Act: Call store (it wraps the call in a DB transaction)
    $service->store($dto, $members);

    // Assert: if no exception, test passes
    $this->assertTrue(true);
  }
}
