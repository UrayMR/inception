<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
  // TODO: Use a good authorization method & use the app's pattern here (services, repositories, etc.)
  public function index(Request $request): Response
  {
    $user = Auth::user();
    $team = $user?->team;
    $competition = $team?->competition;

    $tab = $request->query('tab', 'dashboard');
    $transactionId = $request->query('id');
    $submissions = $team?->submissions()
      ->select('id', 'assignment_id', 'submission_link', 'updated_at', 'created_at')
      ->get()
      ->keyBy('assignment_id');

    return Inertia::render('settings/index', [
      'tab' => $tab,

      // Dashboard tab data
      'competition' => fn() => $competition,
      'schedule' => fn() => $competition?->timelines,
      'transaction' => fn() => $team?->transactions()->latest()->first(),
      'assignments' => fn() => $competition
        ? Assignment::query()
        ->with('competition')
        ->where('competition_id', $competition->id)
        ->orderBy('due_at')
        ->get()
        ->map(fn(Assignment $assignment) => [
          'id' => $assignment->id,
          'competition' => [
            'value' => $assignment->competition?->id,
            'label' => $assignment->competition?->name,
          ],
          'name' => $assignment->name,
          'status' => $assignment->status,
          'due_at' => $assignment->due_at?->toDateTimeString(),
          'assignment_guide_link' => $assignment->assignment_guide_link,
          'submission' => $submissions->has($assignment->id)
            ? [
              'id' => $submissions->get($assignment->id)->id,
              'submission_link' => $submissions->get($assignment->id)->submission_link,
              'updated_at' => $submissions->get($assignment->id)->updated_at?->toDateTimeString(),
              'created_at' => $submissions->get($assignment->id)->created_at?->toDateTimeString(),
            ]
            : null,
        ])
        ->values()
        ->all()
        : [],

      // Transaction detail tab data
      'transactionDetail' => fn() => $tab === 'transaction-detail' && $transactionId
        ? $this->buildTransactionDetail($team, $transactionId)
        : null,
    ]);
  }

  public function submission(Request $request)
  {
    $user = Auth::user();
    $team = $user?->team;
    $competition = $team?->competition;

    if (!$competition) {
      $this->flash('error', 'You are not part of any competition.');
      return redirect()->back();
    }

    $validatedData = $request->validate([
      'assignment_id' => 'required|exists:assignments,id',
      'submission_link' => 'required|url',
    ]);

    $assignment = Assignment::findOrFail($validatedData['assignment_id']);

    if ($assignment->competition_id !== $competition->id) {
      $this->flash('error', 'This assignment does not belong to your competition.');
      return redirect()->back();
    }

    // Check if the assignment is still on due
    if ($assignment->due_at && now()->greaterThan($assignment->due_at)) {
      $this->flash('error', 'The submission deadline for this assignment has passed.');
      return redirect()->back();
    }

    // Create or update the submission
    $team->submissions()->updateOrCreate(
      ['assignment_id' => $assignment->id],
      ['submission_link' => $validatedData['submission_link']]
    );

    $this->flash('success', 'Submission saved successfully.');
    return redirect()->back();
  }

  private function buildTransactionDetail(?Team $team, string $transactionId): array
  {
    $transaction = $team?->transactions()
      ->with(['team.competition', 'team.leader', 'team.members'])
      ->findOrFail($transactionId);

    $transactionTeam = $transaction->team;

    return [
      'id' => $transaction->id,
      'amount' => $transaction->amount,
      'payment_method' => $transaction->payment_method,
      'payment_proof_path' => $transaction->payment_proof_path,
      'status' => $transaction->status,
      'created_at' => $transaction->created_at,
      'updated_at' => $transaction->updated_at,

      'competition_name' => $transactionTeam->competition->name ?? null,
      'competition_type' => $transactionTeam->competition->type ?? null,

      'team_name' => $transactionTeam->team_name,
      'institution' => $transactionTeam->institution,
      'phone_number' => $transactionTeam->phone_number,
      'leader_name' => $transactionTeam->leader->name ?? null,
      'leader_email' => $transactionTeam->leader->email ?? null,
      'members' => $transactionTeam->members,
    ];
  }
}
