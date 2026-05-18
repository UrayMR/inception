<?php

namespace App\Repositories\Competitions;

use App\Models\Competition;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CompetitionRepository
{
    public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

    public function store(array $attributes): Competition;

    public function update(array $attributes, Competition $competition): Competition;

    public function destroy(Competition $competition): bool;

    public function getCompetitionMap(): array;
}
