<?php

namespace App\Http\Controllers\Panel;

use App\Models\Announcement;
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
    // TODO: Change Policy Control
    $this->authorize('viewAny', Announcement::class);

    $announcement = $this->announcementService->index();
    $registrationBatches = $this->registrationBatchService->index();

    return $this->render('panel/config', [
      'announcement' => $announcement,
      'registrationBatches' => $registrationBatches,
    ]);
  }
}
