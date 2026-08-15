<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Resources\Transactions\ShowTransactionResource;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class TransactionController extends Controller
{
  public function show(Transaction $transaction): Response
  {
    $user = Auth::user();

    // Otorisasi sederhana: Pastikan transaksi milik tim pengguna
    if ($transaction->team_id !== $user?->team?->id) {
      abort(403, 'Akses tidak diizinkan.');
    }

    $transaction->load(['team.competition', 'team.leader', 'team.members']);

    $schedule = $transaction->team?->competition?->timelines ?? [];

    return $this->render('settings/transactions/show', [
      'transaction' => ShowTransactionResource::make($transaction)->resolve(),
      'schedule' => $schedule,
    ]);
  }
}
