<?php

namespace App\Services\Announcements;

use App\Enums\FinalAnnouncementStatus;
use App\Enums\FinalAnnouncementType;
use App\Enums\TransactionStatus;
use App\Mail\FinalistAnnouncementMail;
use App\Models\FinalAnnouncementRun;
use App\Models\FinalTeamRecipient;
use App\Models\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Throwable;

class FinalAnnouncementService
{
  private const RESULT_URL = 'https://drive.google.com/drive/';
  private const QUESTIONNAIRE_URL = 'https://drive.google.com/drive/';

  private function normalizeWhitelist(string $input): array
  {
    // Memisah berdasarkan enter (\r\n, \r, \n), koma (,), titik koma (;), atau spasi
    $rawEmails = preg_split('/[\r\n,;]+|\s+/', $input) ?: [];

    $emails = array_values(array_filter(
      array_map(fn($e) => strtolower(trim($e)), $rawEmails)
    ));

    $duplicates = array_diff_assoc($emails, array_unique($emails));
    if (!empty($duplicates)) {
      throw ValidationException::withMessages([
        'whitelist' => 'Terdapat email duplikat: ' . implode(', ', array_unique($duplicates)),
      ]);
    }

    $validator = Validator::make(['emails' => $emails], [
      'emails' => ['required', 'array', 'min:1'],
      'emails.*' => ['required', 'email:rfc'],
    ]);

    if ($validator->fails()) {
      throw ValidationException::withMessages([
        'whitelist' => 'Pastikan semua email valid dan whitelist tidak kosong.',
      ]);
    }

    return $emails;
  }

  /**
   * Query to get all eligible teams for final announcement.
   * Eligible teams must have:
   * - Verified transactions
   * - Leader with email
   * - Submissions
   */
  private function eligibleTeamsQuery()
  {
    return Team::query()
      ->whereHas('transactions', fn($q) => $q->where('status', TransactionStatus::verified->value))
      ->whereHas('leader', fn($q) => $q->whereNotNull('email')->where('email', '!=', ''))
      ->whereHas('submissions')
      ->with('leader', 'competition');
  }

  /**
   * Validate whitelist against eligible teams.
   */
  public function validateWhitelist(string $whitelist): Collection
  {
    $emails = $this->normalizeWhitelist($whitelist);
    $eligibleTeams = $this->eligibleTeamsQuery()->get();

    $eligibleEmails = $eligibleTeams->pluck('leader.email')->map(fn($e) => strtolower(trim($e)))->all();

    foreach ($emails as $email) {
      if (!in_array($email, $eligibleEmails, true)) {
        throw ValidationException::withMessages([
          'whitelist' => "Email {$email} tidak termasuk dalam tim yang eligible.",
        ]);
      }
    }

    return $eligibleTeams->filter(
      fn($team) => in_array(strtolower(trim($team->leader->email)), $emails, true)
    )->values();
  }

  /**
   * Store whitelist for eligible teams.
   */
  public function storeWhitelist(Collection $eligibleTeams): int
  {
    DB::transaction(function () use ($eligibleTeams) {
      if (FinalAnnouncementRun::query()->exists()) {
        throw ValidationException::withMessages([
          'whitelist' => 'Whitelist tidak dapat diubah karena proses pengiriman pengumuman sudah dimulai.',
        ]);
      }

      FinalTeamRecipient::query()->delete();

      $data = $eligibleTeams->map(fn($team) => [
        'id' => \Illuminate\Support\Str::uuid(),
        'team_id' => $team->id,
        'created_at' => now(),
        'updated_at' => now(),
      ])->all();

      FinalTeamRecipient::insert($data);
    });

    Log::info('Whitelist finalist berhasil disimpan.', [
      'total_teams' => $eligibleTeams->count(),
      'created_by' => Auth::id(),
    ]);

    return $eligibleTeams->count();
  }

  /**
   * Send announcement email to team leader.
   */
  private function sendAnnouncement(Team $team, bool $isFinalist): bool
  {
    $type = $isFinalist ? FinalAnnouncementType::finalist->value : FinalAnnouncementType::nonFinalist->value;

    if (!$team->leader || empty($team->leader->email)) {
      Log::error("Email ketua tim tidak ditemukan untuk team_id {$team->id}.");
      $this->updateRunStatus($team->id, $type, FinalAnnouncementStatus::failed->value);
      return false;
    }

    try {
      Mail::to($team->leader->email)->send(new FinalistAnnouncementMail(
        $team->competition->name,
        $team->team_name,
        self::RESULT_URL,
        self::QUESTIONNAIRE_URL,
        $isFinalist,
      ));

      $this->updateRunStatus($team->id, $type, FinalAnnouncementStatus::sent->value);

      Log::info('Email pengumuman berhasil dikirim.', [
        'team_id' => $team->id,
        'announcement_type' => $type,
        'recipient' => $team->leader->email,
      ]);

      return true;
    } catch (Throwable $e) {
      Log::error('Gagal mengirim email pengumuman.', [
        'team_id' => $team->id,
        'announcement_type' => $type,
        'error' => $e->getMessage(),
      ]);

      $this->updateRunStatus($team->id, $type, FinalAnnouncementStatus::failed->value);
      return false;
    }
  }

  /**
   * Helper to insert/update run announcement run status.
   */
  private function updateRunStatus(string $teamId, string $type, string $status): FinalAnnouncementRun
  {
    return FinalAnnouncementRun::query()->updateOrCreate(
      ['team_id' => $teamId],
      ['announcement_type' => $type, 'status' => $status]
    );
  }

  /**
   * Send announcement email to all eligible teams.
   * Teams in whitelist get Finalist email, others get Non-Finalist email.
   */
  public function sendAnnouncements(): void
  {
    $eligibleTeams = $this->eligibleTeamsQuery()->get();

    if ($eligibleTeams->isEmpty()) {
      throw ValidationException::withMessages([
        'announcement' => 'Tidak ada tim yang eligible untuk dikirimkan pengumuman.',
      ]);
    }

    // Get all eligible teams in whitelist finalist teams
    $finalistTeamIds = FinalTeamRecipient::query()->pluck('team_id')->all();

    // Check if any eligible team has already been sent an announcement
    foreach ($eligibleTeams as $team) {
      $run = FinalAnnouncementRun::query()->where('team_id', $team->id)->first();
      if ($run) {
        throw ValidationException::withMessages([
          'announcement' => "Pengiriman email untuk tim {$team->team_name} sudah dilakukan sebelumnya dengan status: {$run->status}.",
        ]);
      }
    }

    // Set initial status 'ready' for all eligible teams
    foreach ($eligibleTeams as $team) {
      // If team is in whitelist = Finalist, otherwise Non-Finalist
      $isFinalist = in_array($team->id, $finalistTeamIds, true);
      $type = $isFinalist ? FinalAnnouncementType::finalist->value : FinalAnnouncementType::nonFinalist->value;

      $run = FinalAnnouncementRun::query()->firstOrCreate(
        ['team_id' => $team->id],
        ['announcement_type' => $type, 'status' => FinalAnnouncementStatus::ready->value]
      );

      if ($run->status === FinalAnnouncementStatus::ready->value) {
        $this->sendAnnouncement($team, $isFinalist);
      }
    }
  }

  /**
   * Send failed emails again.
   */
  public function sendFailedEmails(): void
  {
    $failedRuns = FinalAnnouncementRun::query()
      ->where('status', FinalAnnouncementStatus::failed->value)
      ->with('team.leader')
      ->get();

    foreach ($failedRuns as $run) {
      if (!$run->team) {
        Log::warning('Pengiriman ulang dilewati karena tim tidak ditemukan.', ['team_id' => $run->team_id]);
        continue;
      }

      $isFinalist = $run->announcement_type === FinalAnnouncementType::finalist->value;
      $this->sendAnnouncement($run->team, $isFinalist);
    }
  }
}
