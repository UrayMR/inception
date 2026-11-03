<?php

namespace App\Services\Announcements;

use App\Mail\BulkAnnouncementMail;
use App\Mail\FinalistAnnouncementMail;
use App\Enums\TransactionStatus;
use App\Models\Team;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Throwable;

class MailAnnouncementService
{
  private const RESULT_URL = 'https://drive.google.com/drive/';
  private const QUESTIONNAIRE_URL = 'https://drive.google.com/drive/';

  /**
   * Normalize email input into lowercase unique email list.
   */
  private function normalizeEmails(string $input): array
  {
    $rawEmails = preg_split('/[\r\n,;]+|\s+/', $input) ?: [];

    $emails = array_values(array_filter(
      array_map(fn($email) => strtolower(trim($email)), $rawEmails)
    ));

    $duplicates = array_diff_assoc($emails, array_unique($emails));

    if (!empty($duplicates)) {
      throw ValidationException::withMessages([
        'emails' => 'Terdapat email duplikat: '
          . implode(', ', array_unique($duplicates)),
      ]);
    }

    if (empty($emails)) {
      throw ValidationException::withMessages([
        'emails' => 'Daftar email tidak boleh kosong.',
      ]);
    }

    $validator = Validator::make(['emails' => $emails], [
      'emails' => ['required', 'array', 'min:1'],
      'emails.*' => ['required', 'email:rfc'],
    ]);

    if ($validator->fails()) {
      throw ValidationException::withMessages([
        'emails' => 'Pastikan semua email valid.',
      ]);
    }

    return $emails;
  }

  /**
   * Query all eligible teams for a competition.
   */
  public function eligibleTeamsQuery(string $competitionId)
  {
    return Team::query()
      ->where('competition_id', $competitionId)
      ->whereHas(
        'transactions',
        fn($q) =>
        $q->where('status', TransactionStatus::verified->value)
      )
      ->whereHas(
        'leader',
        fn($q) =>
        $q->whereNotNull('email')
          ->where('email', '!=', '')
      )
      ->with(['leader', 'competition']);
  }

  /**
   * Send announcement email based on announcement type.
   */
  private function sendAnnouncement(
    Team $team,
    string $announcementType,
    bool $isFinalist
  ): bool {
    if (!$team->leader || empty($team->leader->email)) {
      Log::error("Email ketua tim tidak ditemukan untuk team_id {$team->id}.");

      return false;
    }

    try {
      $mail = match ($announcementType) {
        'final' => new FinalistAnnouncementMail(
          $team->competition->name,
          $team->team_name,
          self::RESULT_URL,
          self::QUESTIONNAIRE_URL,
          $isFinalist,
        ),

        'hacking-day' => new BulkAnnouncementMail(
          competitionName: $team->competition?->name ?? 'Hackathon',
          teamName: $team->team_name,
          isBlacklisted: !$isFinalist,
        ),

        default => throw new \InvalidArgumentException(
          "Announcement type tidak valid: {$announcementType}"
        ),
      };

      Mail::to($team->leader->email)->send($mail);

      Log::info('Announcement email berhasil dikirim.', [
        'team_id' => $team->id,
        'competition_id' => $team->competition_id,
        'announcement_type' => $announcementType,
        'email' => $team->leader->email,
        'is_finalist' => $isFinalist,
      ]);

      return true;
    } catch (Throwable $e) {
      Log::error('Gagal mengirim announcement email.', [
        'team_id' => $team->id,
        'competition_id' => $team->competition_id,
        'announcement_type' => $announcementType,
        'email' => $team->leader->email,
        'is_finalist' => $isFinalist,
        'error' => $e->getMessage(),
      ]);

      return false;
    }
  }

  /**
   * Send announcements to all eligible teams.
   *
   * Whitelist:
   * - Listed emails receive Finalist email.
   * - Other teams receive Non-Finalist email.
   *
   * Blacklist:
   * - Listed emails receive Non-Finalist email.
   * - Other teams receive Finalist email.
   */
  public function sendAnnouncements(
    string $emails,
    string $filterType,
    string $competitionId,
    string $announcementType
  ): array {
    // Validate announcement type
    if (!in_array($announcementType, ['final', 'hacking-day'], true)) {
      throw ValidationException::withMessages([
        'announcementType' => 'Tipe pengumuman tidak valid.',
      ]);
    }

    // Validate filter type
    if (!in_array($filterType, ['whitelist', 'blacklist'], true)) {
      throw ValidationException::withMessages([
        'filterType' => 'Tipe filter harus whitelist atau blacklist.',
      ]);
    }

    // Normalize emails
    $emails = $this->normalizeEmails($emails);

    /** @var \Illuminate\Database\Eloquent\Collection<int, Team> $eligibleTeams */
    $eligibleTeams = $this->eligibleTeamsQuery($competitionId)->get();

    if ($eligibleTeams->isEmpty()) {
      throw ValidationException::withMessages([
        'announcement' => 'Tidak ada tim yang eligible untuk dikirimkan pengumuman.',
      ]);
    }

    // Get eligible leader emails
    $eligibleEmails = $eligibleTeams
      ->pluck('leader.email')
      ->filter()
      ->map(fn($email) => strtolower(trim($email)))
      ->unique()
      ->values()
      ->all();

    // Validate input emails
    $invalidEmails = array_diff($emails, $eligibleEmails);

    if (!empty($invalidEmails)) {
      throw ValidationException::withMessages([
        'emails' => 'Email berikut tidak termasuk dalam tim eligible: '
          . implode(', ', $invalidEmails),
      ]);
    }

    // Determine finalist status
    $isWhitelist = $filterType === 'whitelist';

    // Send announcements
    $results = $eligibleTeams->map(function ($team) use (
      $emails,
      $isWhitelist,
      $announcementType
    ) {
      $email = strtolower(trim($team->leader->email));

      $isListed = in_array($email, $emails, true);

      $isFinalist = $isWhitelist
        ? $isListed
        : !$isListed;

      return [
        'team_id' => $team->id,
        'email' => $team->leader->email,
        'is_finalist' => $isFinalist,
        'status' => $this->sendAnnouncement(
          $team,
          $announcementType,
          $isFinalist
        ),
      ];
    });

    return [
      'total' => $results->count(),
      'sent' => $results->where('status', true)->count(),
      'failed' => $results->where('status', false)->count(),
      'finalist' => $results->where('is_finalist', true)->count(),
      'non_finalist' => $results->where('is_finalist', false)->count(),
    ];
  }
}
