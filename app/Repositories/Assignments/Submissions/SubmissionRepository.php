<?php

namespace App\Repositories\Assignments\Submissions;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SubmissionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;
}
