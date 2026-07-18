<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Resources\Assignments\Submissions\IndexSubmissionResource;
use App\Services\Assignments\SubmissionService;
use Illuminate\Http\Request;

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

    return $this->render('panel/submissions/index', [
      'submissions' => IndexSubmissionResource::collection($submissions),
    ]);
  }
}
