<?php

namespace App\Services\Transactions;

use App\Helpers\ThrowException;
use App\Models\SyncTracker;
use App\Models\Transaction;
use App\Services\GoogleSheetService;
use Exception;

class TransactionSyncService
{
  public function __construct(
    protected GoogleSheetService $googleSheetService
  ) {}

  public function handleSync(): int
  {
    $tracker = SyncTracker::where('target_name', 'transactions_to_gsheet')->first();
    $query = Transaction::query()->with(['team.competition', 'registrationBatch'])->orderBy('created_at', 'asc');

    if ($tracker && $tracker->last_synced_id !== '0') {
      $lastTransaction = Transaction::find($tracker->last_synced_id);
      if ($lastTransaction) {
        $query->where('created_at', '>', $lastTransaction->created_at);
      }
    }

    $unsynced = $query->get();

    if ($unsynced->isEmpty()) {
      return 0;
    }

    $sheetData = [];
    foreach ($unsynced as $trx) {

      $detailUrl = route('panel.transactions.show', $trx->id);
      $linkFormula = '=HYPERLINK("' . $detailUrl . '"; "Lihat Bukti")';

      $row = [
        $trx->team->competition->name ?? '-',
        $trx->registrationBatch->name ?? '-',
        $trx->team->team_name ?? '-',
        $trx->team->phone_number ?? '-',
        $trx->team->requirement_link ?? '-',
        $linkFormula,
        $trx->created_at ? $trx->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s'),
        $trx->status ?? '-',
      ];

      $sheetData[] = array_values($row);
    }

    try {
      $this->googleSheetService->appendData('main_data!A2:H', $sheetData);

      $lastTrx = $unsynced->last();
      SyncTracker::updateOrCreate(
        ['target_name' => 'transactions_to_gsheet'],
        [
          'table_name' => 'transactions',
          'last_synced_id' => (string) $lastTrx->id,
          'last_synced_at' => now(),
        ]
      );

      return $unsynced->count();
    } catch (Exception $e) {
      report($e);
      ThrowException::business('Terjadi kesalahan saat sinkronisasi ke Google Sheets');
    }
  }
}
