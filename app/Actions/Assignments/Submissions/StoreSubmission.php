<?php

namespace App\Actions\Assignments\Submissions;

use App\Models\Assignment;
use App\Models\Team;
use App\Repositories\Assignments\Submissions\SubmissionRepository;

class StoreSubmission
{
  public function __construct(
    protected SubmissionRepository $submissionRepository,
  ) {}

  public function handle(Team $team, Assignment $assignment, string $submissionLink): void
  {
    $this->submissionRepository->upsertForTeamAssignment($team, $assignment, $submissionLink);
  }
}
