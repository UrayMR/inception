<?php

namespace Database\Seeders;

use App\Models\Competition;
use App\Models\AssignmentSubmission;
use Illuminate\Database\Seeder;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $competitions = Competition::with('assignments')->get();

        foreach ($competitions as $competition) {
            foreach ($competition->assignments as $assignment) {
                $count = rand(5, 10);

                AssignmentSubmission::factory()->count($count)->create([
                    'assignment_id' => $assignment->id,
                ]);
            }
        }
    }
}
