<?php

namespace App\Exports\Sheets;

use App\Models\Team;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class TeamSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize
{
  public function collection(): Collection
  {
    return Team::query()
      ->with(['competition', 'leader'])
      ->withCount(['members', 'transactions', 'submissions'])
      ->orderBy('created_at')
      ->get();
  }

  public function headings(): array
  {
    return [
      'Team ID',
      'Team Name',
      'Competition',
      'Competition Type',
      'Competition Price',
      'Leader ID',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Institution',
      'Team Status',
      'Is Finalist',
      'Requirement Link',
      'Total Members',
      'Total Transactions',
      'Total Submissions',
      'Registered At',
      'Updated At',
    ];
  }

  public function map($team): array
  {
    return [
      $team->id,
      $team->team_name,
      $team->competition?->name,
      $team->competition?->type,
      $team->competition?->price,
      $team->leader_id,
      $team->leader_name ?? $team->leader?->name,
      $team->leader?->email,
      $team->phone_number,
      $team->institution,
      $team->status,
      $team->is_finalist ? 'Yes' : 'No',
      $team->requirement_link,
      $team->members_count,
      $team->transactions_count,
      $team->submissions_count,
      $team->created_at?->format('Y-m-d H:i:s'),
      $team->updated_at?->format('Y-m-d H:i:s'),
    ];
  }

  public function title(): string
  {
    return 'Teams';
  }
}
