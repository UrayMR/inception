<?php

namespace App\Repositories\Competitions;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GuestCompetitionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;
}
