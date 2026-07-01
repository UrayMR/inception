<?php

namespace App\Services\Competitions;

use App\Repositories\Competitions\GuestCompetitionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class GuestCompetitionService
{
  public function __construct(
    protected GuestCompetitionRepository $guestCompetitionRepository,
  ) {}

  public function index(Request $request, int $perPage = 10): LengthAwarePaginator
  {
    $queryParams = [
      'search' => $request->query('search'),
    ];

    return $this->guestCompetitionRepository->index($queryParams, $perPage);
  }
}
