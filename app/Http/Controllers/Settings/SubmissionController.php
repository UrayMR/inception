<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Enums\TransactionStatus;
use App\Models\Assignment;
use App\Models\Team;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{

  public function storeOrUpdate(Team $team, array $data): void
  {
    $competition = $team->competition;

    if (!$competition) {
      throw new Exception('Anda tidak partisipasi dalam kompetisi apa pun.');
    }

    $assignment = Assignment::findOrFail($data['assignment_id']);

    if ($assignment->competition_id !== $competition->id) {
      throw new Exception('Tugas yang Anda coba kirimkan tidak terkait dengan kompetisi tim Anda.');
    }

    // Check if the team has a verified transaction
    $isTransactionVerified = $team->transactions()
      ->where('status', TransactionStatus::verified->value)
      ->exists();

    if (!$isTransactionVerified) {
      throw new Exception('Anda belum diverifikasi. Mohon tunggu konfirmasi dari panitia.');
    }

    if ($assignment->due_at && now()->greaterThan($assignment->due_at)) {
      throw new Exception('Waktu pengiriman tugas ini telah berakhir.');
    }

    $team->submissions()->updateOrCreate(
      ['assignment_id' => $assignment->id],
      ['submission_link' => $data['submission_link']]
    );
  }

  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'assignment_id' => ['required', 'exists:assignments,id'],
      'submission_link' => ['required', 'url'],
    ]);

    $user = Auth::user();

    if (!$user?->team) {
      $this->flash('error', 'Anda tidak memiliki tim.');
      return redirect()->back();
    }

    try {
      $this->storeOrUpdate($user->team, $validated);
      $this->flash('success', 'Pengiriman tugas berhasil.');
    } catch (Exception $e) {
      $this->flash('error', $e->getMessage());
    }

    return redirect()->back();
  }
}
