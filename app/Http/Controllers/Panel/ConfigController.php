<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Services\Announcements\AnnouncementService;
use App\Services\Batches\RegistrationBatchService;

class ConfigController extends Controller
{
  public function __construct(
    protected AnnouncementService $announcementService,
    protected RegistrationBatchService $registrationBatchService,
  ) {}

  public function index()
  {
    $announcement = $this->announcementService->index();
    $registrationBatches = $this->registrationBatchService->index();

    return $this->render('panel/config', [
      'announcement' => $announcement,
      'registrationBatches' => $registrationBatches,
    ]);
  }
}
