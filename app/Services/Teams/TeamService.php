<?php

namespace App\Services\Teams;

use App\Repositories\Teams\TeamRepository;
use Illuminate\Http\Request;

class TeamService
{
    public function __construct(
        protected TeamRepository $teamRepository,
    ) {}

    public function index(Request $request)
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'type' => $request->query('type'),
                // Add more filters if needed
            ],
        ];

        return $this->teamRepository->index($queryParams);
    }
}
