<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
  public function index(Request $request): Response
  {
    $user = Auth::user();
    $team = $user?->team;
    $competition = $team?->competition;

    $tab = $request->query('tab', 'dashboard');
    $transactionId = $request->query('id');

    return Inertia::render('settings/index', [
      'tab' => $tab,

      // Dashboard tab data
      'competition' => fn() => $competition,
      'schedule' => fn() => $competition?->timelines,
      'transaction' => fn() => $team?->transactions()->latest()->first(),

      // Transaction detail tab data
      'transactionDetail' => fn() => $tab === 'transaction-detail' && $transactionId
        ? $this->buildTransactionDetail($team, $transactionId)
        : null,
    ]);
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
