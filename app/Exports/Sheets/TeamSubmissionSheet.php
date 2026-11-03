<?php

namespace App\Exports\Sheets;

use App\Models\AssignmentSubmission;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class TeamSubmissionSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize
{
  public function collection(): Collection
  {
    return AssignmentSubmission::query()
      ->with([
        'team.competition',
        'team.leader',
        'assignment.competition',
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
      'Submission ID',
      'Assignment ID',
      'Assignment Name',
      'Assignment Competition',
      'Assignment Status',
      'Assignment Guide Link',
      'Due At',
      'Submission Link',
      'Submitted At',
      'Updated At',
    ];
  }

  public function map($submission): array
  {
    return [
      $submission->team_id,
      $submission->team?->team_name,
      $submission->team?->competition?->name,
      $submission->team?->leader_name
        ?? $submission->team?->leader?->name,
      $submission->team?->leader?->email,
      $submission->id,
      $submission->assignment_id,
      $submission->assignment?->name,
      $submission->assignment?->competition?->name,
      $submission->assignment?->status,
      $submission->assignment?->assignment_guide_link,
      $submission->assignment?->due_at?->format('Y-m-d H:i:s'),
      $submission->submission_link,
      $submission->created_at?->format('Y-m-d H:i:s'),
      $submission->updated_at?->format('Y-m-d H:i:s'),
    ];
  }

  public function title(): string
  {
    return 'Submissions';
  }
}
