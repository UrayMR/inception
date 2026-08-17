<?php

namespace App\Services\Assignments;

use App\Actions\Assignments\Submissions\StoreSubmission;
use App\DTOs\Assignments\StoreSubmissionDTO;
use App\Enums\AssignmentStatus;
use App\Enums\CompetitionStatus;
use App\Helpers\ThrowException;
use App\Models\Team;
use App\Repositories\Assignments\AssignmentRepository;
use App\Repositories\Assignments\Submissions\SubmissionRepository;
use App\Repositories\Transactions\TransactionRepository;
use Illuminate\Support\Facades\DB;

class SubmissionService
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
    protected TransactionRepository $transactionRepository,
    protected SubmissionRepository $submissionRepository,
    protected StoreSubmission $storeSubmission,
  ) {}

  public function index(array $queryParams)
  {
    // Only allow specific query params
    $cleanParams = [
      'search' => $queryParams['search'] ?? null,
      'filters' => [
        'type' => $queryParams['filters']['type'] ?? null,
        // Add more filters if needed
      ],
    ];

    return $this->submissionRepository->index($cleanParams);
  }

  public function storeOrUpdate(Team $team, StoreSubmissionDTO $dto): void
  {
    $competition = $team->competition;

    if (! $competition) {
      ThrowException::business('Anda tidak partisipasi dalam kompetisi apa pun.');
    }

    $assignment = $this->assignmentRepository->findByIdOrFail($dto->assignment_id);

    if ($assignment->competition_id !== $competition->id) {
      ThrowException::business('Tugas yang Anda coba kirimkan tidak terkait dengan kompetisi tim Anda.');
    }

    if ($assignment->status !== AssignmentStatus::active->value || $competition->status !== CompetitionStatus::ongoing->value) {
      ThrowException::business('Tugas ini belum dibuka untuk pengiriman. Mohon coba lagi nanti.');
    }

    if (! $this->transactionRepository->hasVerifiedTransaction($team)) {
      ThrowException::business('Anda belum diverifikasi. Mohon tunggu konfirmasi dari panitia.');
    }

    if ($assignment->due_at && now()->greaterThan($assignment->due_at)) {
      ThrowException::business('Waktu pengiriman tugas ini telah berakhir.');
    }

    DB::transaction(function () use ($team, $assignment, $dto) {
      $this->storeSubmission->handle($team, $assignment, $dto->submission_link);
    });
  }
}
