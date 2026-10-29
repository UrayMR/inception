<?php

namespace App\Services\Announcements;

use App\Enums\TransactionStatus;
use App\Mail\BulkAnnouncementMail;
use App\Models\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Throwable;

class BulkAnnouncementService
{
  private const RESULT_URL = 'https://drive.google.com/drive/';

  /**
   * Normalize blacklist text into lowercase unique email list.
   */
  public function normalizeBlacklist(string $input): array
  {
    $rawEmails = preg_split('/[\r\n,;]+|\s+/', $input) ?: [];

    $emails = array_values(array_filter(
      array_map(fn($email) => strtolower(trim($email)), $rawEmails)
    ));

    $duplicates = array_diff_assoc($emails, array_unique($emails));
    if (!empty($duplicates)) {
      throw ValidationException::withMessages([
        'blacklist' => 'Terdapat email duplikat: ' . implode(', ', array_unique($duplicates)),
      ]);
    }

    if (empty($emails)) {
      return [];
    }

    $validator = Validator::make(['emails' => $emails], [
      'emails' => ['array'],
      'emails.*' => ['required', 'email:rfc'],
    ]);

    if ($validator->fails()) {
      throw ValidationException::withMessages([
        'blacklist' => 'Pastikan semua email dalam blacklist valid.',
      ]);
    }

    return $emails;
  }

  /**
   * Query all Hackathon teams that have leader email.
   */
  public function hackathonTeamsQuery()
  {
    return Team::query()
      ->whereHas('transactions', fn($q) => $q->where('status', TransactionStatus::verified->value))
      ->whereHas('competition', fn($q) => $q->whereRaw('LOWER(name) LIKE ?', ['%hackathon%']))
      ->whereHas('leader', fn($q) => $q->whereNotNull('email')->where('email', '!=', ''))
      ->whereHas('submissions')
      ->with(['leader', 'competition']);
  }

  public function validateBlacklist(string $blacklistText): Collection
  {
    $emails = $this->normalizeBlacklist($blacklistText);
    $eligibleTeams = $this->hackathonTeamsQuery()->get();

    $eligibleEmails = $eligibleTeams->pluck('leader.email')->map(fn($e) => strtolower(trim($e)))->all();

    foreach ($emails as $email) {
      if (!in_array($email, $eligibleEmails, true)) {
        throw ValidationException::withMessages([
          'blacklist' => "Email {$email} tidak termasuk dalam tim yang eligible.",
        ]);
      }
    }

    return $eligibleTeams->filter(
      fn($team) => in_array(strtolower(trim($team->leader->email)), $emails, true)
    )->values();
  }

  /**
   * Send bulk announcements to all Hackathon teams.
   */
  public function sendAnnouncements(string $blacklistText): array
  {
    $eligibleTeams = $this->validateBlacklist($blacklistText);
    $normalizedBlacklist = $this->normalizeBlacklist($blacklistText);

    $sent = 0;
    $failed = 0;

    foreach ($eligibleTeams as $team) {
      $email = strtolower(trim((string) $team->leader?->email));
      $isBlacklisted = in_array($email, $normalizedBlacklist, true);

      try {
        Mail::to($team->leader->email)->send(new BulkAnnouncementMail(
          competitionName: $team->competition?->name ?? 'Hackathon',
          teamName: $team->team_name,
          resultUrl: self::RESULT_URL,
          isBlacklisted: $isBlacklisted,
        ));

        $sent++;

        Log::info('Bulk announcement email berhasil dikirim.', [
          'team_id' => $team->id,
          'competition_id' => $team->competition_id,
          'email' => $team->leader->email,
          'is_blacklisted' => $isBlacklisted,
        ]);
      } catch (Throwable $e) {
        $failed++;

        Log::error('Gagal mengirim bulk announcement email.', [
          'team_id' => $team->id,
          'competition_id' => $team->competition_id,
          'email' => $team->leader?->email,
          'is_blacklisted' => $isBlacklisted,
          'error' => $e->getMessage(),
        ]);
      }
    }

    return [
      'total' => $eligibleTeams->count(),
      'sent' => $sent,
      'failed' => $failed,
      'blacklisted' => $this->countBlacklistedRecipients($eligibleTeams, $normalizedBlacklist),
    ];
  }

  private function countBlacklistedRecipients(Collection $teams, array $blacklist): int
  {
    return $teams
      ->filter(fn($team) => in_array(strtolower(trim((string) $team->leader?->email)), $blacklist, true))
      ->count();
  }
}
