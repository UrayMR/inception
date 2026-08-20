<?php

namespace App\Repositories\Competitions;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface GuestCompetitionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

  public function getFeaturedForHome(): Collection;
}
