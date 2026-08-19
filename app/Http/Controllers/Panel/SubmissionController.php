<?php

namespace App\Http\Controllers\Panel;

use App\Exports\SubmissionsExport;
use App\Helpers\ThrowException;
use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Competition;
use App\Resources\Assignments\Submissions\IndexSubmissionResource;
use App\Services\Assignments\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SubmissionController extends Controller
{
  public function __construct(
    protected SubmissionService $submissionService,
  ) {}

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $this->authorize('viewAny', Assignment::class);

    $queryParams = $request->all();
    $submissions = $this->submissionService->index($queryParams);
    $schedule = Auth::user()?->team?->competition?->timelines ?? [];

    $competitions = Competition::withCount(['assignments as has_submissions' => function ($query) {
      $query->whereHas('submission');
    }])->get(['id', 'name'])->map(function (Competition $competition) {
      return [
        'value' => $competition->id,
        'label' => $competition->name,
        'otherValues' => [
          'hasSubmissions' => $competition->has_submissions > 0,
        ],
      ];
    })->toArray();

    return $this->render('panel/submissions/index', [
      'submissions' => IndexSubmissionResource::collection($submissions),
      'schedule' => $schedule,
      'competitions' => $competitions
    ]);
  }

  /**
   * Export submissions to Excel file.
   */
  public function export(Request $request): BinaryFileResponse
  {
    $this->authorize('viewAny', Assignment::class);

    $competitionIds = $request->has('competitions')
      ? explode(',', $request->query('competitions'))
      : [];

    if (empty($competitionIds)) {
      ThrowException::business('Tidak ada kompetisi yang dipilih.');
    }

    $competitions = Competition::whereIn('id', $competitionIds)
      ->whereHas('assignments.submission')
      ->get();

    if ($competitions->isEmpty()) {
      ThrowException::business('Kompetisi yang dipilih tidak memiliki data submission sama sekali.');
    }

    if ($competitions->count() === 1) {
      $comp = $competitions->first();
      $fileName = "pengumpulan-tugas-$comp->slug-" . now()->format('Y-m-d') . ".xlsx";
      return Excel::download(new SubmissionsExport($comp->id), $fileName);
    }

    $zipFileName = 'pengumpulan-tugas-' . now()->format('Y-m-d-His') . '.zip';

    Storage::disk('local')->makeDirectory('temp');
    $zipPath = Storage::disk('local')->path("temp/$zipFileName");

    $zip = new \ZipArchive;
    if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
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

    // Bersihkan file excel satuan
    foreach ($competitions as $comp) {
      $excelName = "pengumpulan-tugas-$comp->slug.xlsx";
      Storage::disk('local')->delete("temp/$excelName");
    }

    return response()->download($zipPath)->deleteFileAfterSend(true);
  }
}
