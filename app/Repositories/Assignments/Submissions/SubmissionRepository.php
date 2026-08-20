<?php

namespace App\Repositories\Assignments\Submissions;

use App\Models\Assignment;
use App\Models\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SubmissionRepository
{
  public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

  public function upsertForTeamAssignment(Team $team, Assignment $assignment, string $submissionLink): void;
}
