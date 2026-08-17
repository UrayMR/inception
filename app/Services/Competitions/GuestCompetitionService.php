<?php

namespace App\Services\Competitions;

use App\Repositories\Competitions\EloquentGuestCompetitionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class GuestCompetitionService
{
  public function __construct(
    protected EloquentGuestCompetitionRepository $guestCompetitionRepository,
  ) {}

  public function index(Request $request, int $perPage = 10): LengthAwarePaginator
  {
    $queryParams = [
      'search' => $request->query('search'),
    ];

    return $this->guestCompetitionRepository->index($queryParams, $perPage);
  }

  public function featuredForHome(): Collection
  {
    return $this->guestCompetitionRepository->getFeaturedForHome();
  }
}
