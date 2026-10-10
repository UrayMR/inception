<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Resources\Assignments\Submissions\IndexSubmissionResource;
use App\Services\Assignments\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    $this->authorize('viewAny', AssignmentSubmission::class);

    $queryParams = $request->all();
    $user = Auth::user();
    $accessibleCompetitionIds = $this->submissionService->getAccessibleCompetitionIds($user);

    $submissions = $this->submissionService->index($queryParams, $user);

    $schedule = $user?->team?->competition?->timelines ?? [];
    $competitions = $this->submissionService->getCompetitionOptions($accessibleCompetitionIds);

    return $this->render('panel/submissions/index', [
      'submissions' => IndexSubmissionResource::collection($submissions),
      'schedule' => $schedule,
      'competitions' => $competitions,
    ]);
  }

  /**
   * Export submissions to Excel file.
   */
  public function export(Request $request): BinaryFileResponse
  {
    $this->authorize('export', AssignmentSubmission::class);

    $user = Auth::user();
    $requestedCompetitionIds = $this->submissionService->resolveExportCompetitionIds($request, $user);
    $exportPath = $this->submissionService->exportForCompetitions($requestedCompetitionIds);

    $fileName = basename($exportPath);

    return response()->download($exportPath, $fileName)->deleteFileAfterSend(true);
  }
}
