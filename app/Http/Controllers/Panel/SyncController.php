<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\SyncTracker;
use App\Services\Transactions\TransactionSyncService;

class SyncController extends Controller
{

  public function __construct(
    protected TransactionSyncService $transactionSyncService
  ) {}

  public function syncTransactionsToGoogleSheet()
  {
    $this->authorize('syncTransactions', SyncTracker::class);

    $syncedCount = $this->transactionSyncService->handleSync();

    if ($syncedCount === 0) {
      $this->flash('info', 'Semua data sudah tersinkronisasi. Tidak ada data baru.');
    } else {
      $this->flash('success', "Sinkronisasi berhasil! {$syncedCount} transaksi telah disinkronisasi.");
    }

    return back();
  }
}
