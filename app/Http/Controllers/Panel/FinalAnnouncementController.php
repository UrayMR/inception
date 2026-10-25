<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\FinalAnnouncementRun;
use App\Models\FinalTeamRecipient;
use App\Services\Announcements\FinalAnnouncementService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FinalAnnouncementController extends Controller
{
  public function __construct(
    protected FinalAnnouncementService $finalAnnouncementService
  ) {}

  public function manage()
  {
    $finalist = FinalTeamRecipient::with(['team.leader', 'team.competition'])->get();
    $failedEmails = FinalAnnouncementRun::with(['team.leader', 'team.competition'])->where('status', 'failed')->get();

    return $this->render('panel/final-announcement/manage', [
      'finalists' => $finalist,
      'failedEmails' => $failedEmails,
    ]);
  }

  public function check(Request $request)
  {
    $validated = $request->validate([
      'whitelist' => ['required', 'string'],
    ]);

    $validatedTeams = $this->finalAnnouncementService->validateWhitelist($validated['whitelist']);

    $totalTeams = $this->finalAnnouncementService->storeWhitelist($validatedTeams);

    $this->flash('success', "$totalTeams tim telah berhasil disimpan sebagai whitelist finalist.");

    return redirect()->route('panel.final-announcement.manage');
  }

  /**
   * Mengirimkan seluruh email pengumuman (Finalist & Non-Finalist).
   */
  public function send()
  {
    try {
      $this->finalAnnouncementService->sendAnnouncements();
      $this->flash('success', 'Seluruh email pengumuman finalist dan non-finalist berhasil dikirim.');
    } catch (ValidationException $e) {
      $this->flash('error', $e->getMessage());
    }

    return redirect()->route('panel.final-announcement.manage');
  }

  /**
   * Mengirim ulang email yang statusnya failed.
   */
  public function retry()
  {
    $this->finalAnnouncementService->sendFailedEmails();

    $this->flash('success', 'Proses pengiriman ulang email yang gagal telah selesai.');

    return redirect()->route('panel.final-announcement.manage');
  }
}
