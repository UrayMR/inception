<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Competition;
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

  public function manage(Request $request)
  {
    $competitionId = $request->query('competitionId');

    $finalists = FinalTeamRecipient::with(['team.leader', 'team.competition'])
      ->when($competitionId, fn($q) => $q->whereHas(
        'team',
        fn($t) => $t->where('competition_id', $competitionId)
      ))
      ->get()
      ->map(function ($recipient) use ($competitionId) {
        $run = FinalAnnouncementRun::query()
          ->where('team_id', $recipient->team_id)
          ->when($competitionId, fn($q) => $q->whereHas(
            'team',
            fn($t) => $t->where('competition_id', $competitionId)
          ))
          ->first();

        return [
          'id' => $recipient->team->id,
          'team_name' => $recipient->team->team_name,
          'leader' => $recipient->team->leader,
          'competition' => $recipient->team->competition,
          'announcement_type' => $run?->announcement_type ?? 'finalist',
          'status' => $run?->status ?? 'ready',
        ];
      });

    $eligibleTeams = $this->finalAnnouncementService
      ->eligibleTeamsQuery($competitionId)
      ->get();

    $finalistIds = $finalists->pluck('id')->all();

    $announcementRuns = FinalAnnouncementRun::query()
      ->whereIn('team_id', $eligibleTeams->pluck('id'))
      ->get()
      ->keyBy('team_id');

    $nonFinalists = $eligibleTeams
      ->reject(fn($team) => in_array($team->id, $finalistIds, true))
      ->map(function ($team) use ($announcementRuns) {
        $run = $announcementRuns->get($team->id);

        return [
          'id' => $team->id,
          'team_name' => $team->team_name,
          'leader' => $team->leader,
          'competition' => $team->competition,
          'announcement_type' => $run?->announcement_type ?? 'non-finalist',
          'status' => $run?->status ?? 'ready',
        ];
      })
      ->values();

    $failedEmails = FinalAnnouncementRun::with(['team.leader', 'team.competition'])
      ->where('status', 'failed')
      ->when($competitionId, fn($q) => $q->whereHas(
        'team',
        fn($t) => $t->where('competition_id', $competitionId)
      ))
      ->get();

    $competitions = Competition::select('id', 'name')->get();

    return $this->render('panel/final-announcement/manage', [
      'finalists' => $finalists,
      'nonFinalists' => $nonFinalists,
      'competitions' => $competitions,
      'selectedCompetitionId' => $competitionId,
      'failedEmails' => $failedEmails,
    ]);
  }

  public function check(Request $request)
  {
    $validated = $request->validate([
      'whitelist' => ['required', 'string'],
      'competitionId' => ['required', 'string', "exists:competitions,id"],
    ]);

    $competitionId = $validated['competitionId'];

    $validatedTeams = $this->finalAnnouncementService->validateWhitelist($validated['whitelist'], $competitionId);

    $totalTeams = $this->finalAnnouncementService->storeWhitelist($validatedTeams, $competitionId);

    $this->flash('success', "$totalTeams tim pada kompetisi $competitionId telah berhasil disimpan sebagai whitelist finalist.");

    return redirect()->route('panel.final-announcement.manage', ['competitionId' => $competitionId]);
  }

  /**
   * Mengirimkan seluruh email pengumuman (Finalist & Non-Finalist).
   */
  public function send(Request $request)
  {
    $competitionId = $request->query('competitionId');

    try {
      $this->finalAnnouncementService->sendAnnouncements($competitionId);
      $this->flash('success', "Email pengumuman finalist dan non-finalist pada kompetisi $competitionId telah berhasil dikirim.");
    } catch (ValidationException $e) {
      $this->flash('error', $e->getMessage());
    }

    return redirect()->route('panel.final-announcement.manage', ['competitionId' => $competitionId]);
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
