<?php

namespace App\Repositories\Assignments;

use App\Models\Assignment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SubmissionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

}
