<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Competition;
use App\Resources\Assignments\Submissions\IndexSubmissionResource;
use App\Services\Assignments\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
