<?php

namespace Tests\Feature\Panel\Team;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class TeamTestCase extends TestCase
{
  use RefreshDatabase;

  protected function makeAdminUser(): User
  {
    return User::factory()->create([
      'role' => UserRole::admin->value,
    ]);
  }
}
