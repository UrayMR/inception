<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Resources\Assignments\UserAssignmentSubmissionResource;
use App\Services\Settings\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class DashboardController extends Controller
{
  public function __construct(
    protected DashboardService $dashboardService,
  ) {}

  public function index(): Response
  {
    $user = Auth::user();
    $data = $this->dashboardService->getDashboardData($user?->team);

    return $this->render('settings/dashboard', [
      'competition' => $data['competition'],
      'schedule' => $data['schedule'],
      'transaction' => $data['transaction'],
      'assignments' => UserAssignmentSubmissionResource::collection($data['assignments'])->resolve(),
    ]);
  }
}
