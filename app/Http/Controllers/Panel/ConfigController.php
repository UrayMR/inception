<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Services\Announcements\AnnouncementService;
use App\Services\Batches\RegistrationBatchService;
use App\Services\Competitions\CompetitionService;

class ConfigController extends Controller
{
  public function __construct(
    protected AnnouncementService $announcementService,
    protected RegistrationBatchService $registrationBatchService,
    protected CompetitionService $competitionService
  ) {}

  public function index()
  {
    $announcement = $this->announcementService->index();
    $registrationBatches = $this->registrationBatchService->index();
    $competitions = $this->competitionService->getCompetitionMap();

    return $this->render('panel/config', [
      'announcement' => $announcement,
      'competitions' => $competitions,
      'registrationBatches' => $registrationBatches,
    ]);
  }
}
