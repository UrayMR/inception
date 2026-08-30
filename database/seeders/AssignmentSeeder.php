<?php

namespace Database\Seeders;

use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Models\Competition;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
  public function run(): void
  {
    $assignment_name = 'Pengumpulan Final Project';

    // Ambil kompetisi beserta data timeline-nya
    $competitions = Competition::with('timelines')->get();

    foreach ($competitions as $competition) {
      $submissionTimeline = $competition->timelines
        ->where('timeline_name', 'Submission')
        ->first();

      $dueAt = $submissionTimeline ? $submissionTimeline->end_at : null;

      Assignment::updateOrCreate(
        [
          'competition_id' => $competition->id,
          'name'           => $assignment_name,
        ],
        [
          'assignment_guide_link' => 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing',
          'due_at'                => $dueAt,
          'status'                => AssignmentStatus::inactive->value,
        ]
      );
    }
  }
}
