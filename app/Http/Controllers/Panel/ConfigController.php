<?php

namespace App\Http\Controllers\Panel;

use App\Models\Announcement;
use App\Http\Controllers\Controller;
use App\Services\Announcements\AnnouncementService;

class ConfigController extends Controller
{
  public function __construct(
    protected AnnouncementService $announcementService,
  ) {}

  public function index()
  {
    $this->authorize('viewAny', Announcement::class);

    $announcement = $this->announcementService->index();

    return $this->render('panel/config/index', [
      'announcement' => $announcement,
    ]);
  }
}
