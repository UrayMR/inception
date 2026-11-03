<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Services\Announcements\AnnouncementService;
use App\Services\Announcements\BulkAnnouncementService;
use App\Services\Announcements\FinalAnnouncementService;
use App\Services\Announcements\MailAnnouncementService;
use App\Services\Batches\RegistrationBatchService;
use App\Services\Competitions\CompetitionService;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
  public function __construct(
    protected AnnouncementService $announcementService,
    protected RegistrationBatchService $registrationBatchService,
    protected CompetitionService $competitionService,
    protected MailAnnouncementService $mailAnnouncementService,
  ) {}

  public function index()
  {
    return $this->render('panel/config', [
      'announcement' => $this->announcementService->index(),
      'competitions' => $this->competitionService->getCompetitionMap(),
      'registrationBatches' => $this->registrationBatchService->index(),
    ]);
  }

  public function dispatchAnnouncement(Request $request)
  {
    $validated = $request->validate([
      'competitionId' => ['required', 'string', 'exists:competitions,id'],
      'announcementType' => ['required', 'in:final,hacking-day'],
      'filterType' => ['required', 'in:blacklist,whitelist'],
      'emails' => ['required', 'string'],
    ]);

    $result = $this->mailAnnouncementService->sendAnnouncements(
      $validated['emails'],
      $validated['filterType'],
      $validated['competitionId'],
      $validated['announcementType']
    );

    $announcementName = $validated['announcementType'] === 'final'
      ? 'Final Announcement'
      : 'Hacking Day Announcement';
      
    $this->flash('success', "{$announcementName} selesai. Total: {$result["total"]}, terkirim: {$result["sent"]}, gagal: {$result["failed"]}, lolos: {$result["finalist"]}, tidak lolos: {$result["non_finalist"]}.");


    return redirect()->route('panel.configuration');
  }
}
