<?php

namespace App\Repositories\Teams;

use App\Models\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TeamRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

  public function store(array $attributes): Team;

  public function update(array $attributes, Team $team): Team;

  public function destroy(Team $team): bool;
}
