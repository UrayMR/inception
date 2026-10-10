<?php

namespace App\Services\Assignments;

use App\Actions\Assignments\Submissions\StoreSubmission;
use App\DTOs\Assignments\StoreSubmissionDTO;
use App\Enums\AssignmentStatus;
use App\Enums\CompetitionStatus;
use App\Enums\UserRole;
use App\Exports\SubmissionsExport;
use App\Helpers\ThrowException;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use App\Repositories\Assignments\AssignmentRepository;
use App\Repositories\Assignments\Submissions\SubmissionRepository;
use App\Repositories\Transactions\TransactionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class SubmissionService
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
    protected TransactionRepository $transactionRepository,
    protected SubmissionRepository $submissionRepository,
    protected StoreSubmission $storeSubmission,
  ) {}

  public function getAccessibleCompetitionIds(?User $user): ?array
  {
    if (! $user) {
      return null;
    }

    if ($user->role === UserRole::admin->value) {
      return null;
    }

    return $user->managedCompetitions()->pluck('competitions.id')->all();
  }

  public function getCompetitionOptions(?array $accessibleCompetitionIds = null): array
  {
    $query = Competition::query()->withCount(['assignments as has_submissions' => function ($query) {
      $query->whereHas('submission');
    }]);

    if ($accessibleCompetitionIds !== null) {
      $query->whereIn('id', $accessibleCompetitionIds);
    }

    return $query->get(['id', 'name'])->map(function (Competition $competition) {
      return [
        'value' => $competition->id,
        'label' => $competition->name,
        'otherValues' => [
          'hasSubmissions' => $competition->has_submissions > 0,
        ],
      ];
    })->toArray();
  }

  public function resolveExportCompetitionIds(Request $request, ?User $user): array
  {
    $accessibleCompetitionIds = $this->getAccessibleCompetitionIds($user);
    $requestedCompetitionIds = $request->has('competitions')
      ? array_values(array_filter(explode(',', $request->query('competitions'))))
      : [];

    if (empty($requestedCompetitionIds)) {
      ThrowException::business('Tidak ada kompetisi yang dipilih.');
    }

    if ($accessibleCompetitionIds !== null) {
      $requestedCompetitionIds = array_values(array_intersect($requestedCompetitionIds, $accessibleCompetitionIds));
    }

    if (empty($requestedCompetitionIds)) {
      ThrowException::business('Anda tidak memiliki akses ke kompetisi yang dipilih.');
    }

    return $requestedCompetitionIds;
  }

  public function index(array $queryParams, ?User $user = null)
  {
    $accessibleCompetitionIds = $this->getAccessibleCompetitionIds($user);

    // Only allow specific query params
    $cleanParams = [
      'search' => $queryParams['search'] ?? null,
      'filters' => [
        'competition' => $queryParams['filters']['competition'] ?? null,
        'type' => $queryParams['filters']['type'] ?? null,
        'competition_ids' => $accessibleCompetitionIds,
      ],
    ];

    return $this->submissionRepository->index($cleanParams);
  }

  public function exportForCompetitions(array $competitionIds): string
  {
    $competitions = Competition::whereIn('id', $competitionIds)
      ->whereHas('assignments.submission')
      ->get();

    if ($competitions->isEmpty()) {
      ThrowException::business('Kompetisi yang dipilih tidak memiliki data submission sama sekali.');
    }

    if ($competitions->count() === 1) {
      $comp = $competitions->first();
      $fileName = "pengumpulan-tugas-$comp->slug-" . now()->format('Y-m-d') . '.xlsx';

      Excel::store(new SubmissionsExport($comp->id), "temp/$fileName", 'local');

      return Storage::disk('local')->path("temp/$fileName");
    }

    $zipFileName = 'pengumpulan-tugas-' . now()->format('Y-m-d-His') . '.zip';
    $zipPath = Storage::disk('local')->path("temp/$zipFileName");

    Storage::disk('local')->makeDirectory('temp');

    $zip = new \ZipArchive;
    if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
      foreach ($competitions as $comp) {
        $excelName = "pengumpulan-tugas-$comp->slug.xlsx";
        $relativePath = "temp/$excelName";
        $excelPath = Storage::disk('local')->path($relativePath);

        Excel::store(new SubmissionsExport($comp->id), $relativePath, 'local');

        if (file_exists($excelPath)) {
          $zip->addFile($excelPath, $excelName);
        }
      }
      $zip->close();
    }

    foreach ($competitions as $comp) {
      $excelName = "pengumpulan-tugas-$comp->slug.xlsx";
      Storage::disk('local')->delete("temp/$excelName");
    }

    return $zipPath;
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
