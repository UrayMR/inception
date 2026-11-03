<?php

namespace App\Exports\Sheets;

use App\Models\Transaction;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class TeamTransactionSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize
{
  public function collection(): Collection
  {
    return Transaction::query()
      ->with([
        'team.competition',
        'team.leader',
        'registrationBatch',
      ])
      ->orderBy('team_id')
      ->orderBy('created_at')
      ->get();
  }

  public function headings(): array
  {
    return [
      'Team ID',
      'Team Name',
      'Competition',
      'Leader Name',
      'Leader Email',
      'Transaction ID',
      'Amount',
      'Payment Method',
      'Payment Proof Path',
      'Transaction Status',
      'Registration Batch ID',
      'Registration Batch',
      'Created At',
      'Updated At',
    ];
  }

  public function map($transaction): array
  {
    return [
      $transaction->team_id,
      $transaction->team?->team_name,
      $transaction->team?->competition?->name,
      $transaction->team?->leader_name
        ?? $transaction->team?->leader?->name,
      $transaction->team?->leader?->email,
      $transaction->id,
      $transaction->amount,
      $transaction->payment_method,
      $transaction->payment_proof_path,
      $transaction->status,
      $transaction->registration_batch_id,
      $transaction->registrationBatch?->name,
      $transaction->created_at?->format('Y-m-d H:i:s'),
      $transaction->updated_at?->format('Y-m-d H:i:s'),
    ];
  }

  public function title(): string
  {
    return 'Transactions';
  }
}
