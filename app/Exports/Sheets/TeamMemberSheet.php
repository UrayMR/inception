<?php

namespace App\Exports\Sheets;

use App\Models\TeamMember;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class TeamMemberSheet implements
  FromCollection,
  WithHeadings,
  WithMapping,
  WithTitle,
  ShouldAutoSize
{
  public function collection(): Collection
  {
    return TeamMember::query()
      ->with(['team.competition'])
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
      'Member ID',
      'Member Name',
      'Member Phone',
      'Created At',
      'Updated At',
    ];
  }

  public function map($member): array
  {
    return [
      $member->team_id,
      $member->team?->team_name,
      $member->team?->competition?->name,
      $member->id,
      $member->member_name,
      $member->member_phone_number,
      $member->created_at?->format('Y-m-d H:i:s'),
      $member->updated_at?->format('Y-m-d H:i:s'),
    ];
  }

  public function title(): string
  {
    return 'Members';
  }
}
