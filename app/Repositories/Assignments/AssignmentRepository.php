<?php

namespace App\Repositories\Assignments;

use App\Models\Assignment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AssignmentRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

  public function store(array $attributes): Assignment;

  public function update(array $attributes, Assignment $assignment): Assignment;

  public function destroy(Assignment $assignment): bool;
}
