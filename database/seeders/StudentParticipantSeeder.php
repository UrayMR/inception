<?php

namespace Database\Seeders;

use App\Enums\AssignmentStatus;
use App\Enums\CompetitionStatus;
use App\Enums\RegistrationBatchStatus;
use App\Enums\TeamStatus;
use App\Enums\TransactionMethod;
use App\Enums\TransactionStatus;
use App\Enums\UserRole;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Competition;
use App\Models\RegistrationBatch;
use App\Models\Team;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentParticipantSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $competition = Competition::query()
      ->with('assignments')
      ->where('name', 'Business Plan')
      ->first();

    if (! $competition) {
      $competition = Competition::query()->with('assignments')->first();
    }

    if (! $competition) {
      throw new \RuntimeException('Tidak ada competition yang tersedia untuk dibuatkan data participant.');
    }

    $competition->update([
      'status' => CompetitionStatus::ongoing->value,
    ]);

    $assignment = $competition->assignments()->first();

    if (! $assignment) {
      $assignment = Assignment::create([
        'competition_id' => $competition->id,
        'name' => 'Assignment Hackathon',
        'assignment_guide_link' => 'https://example.com/assignment/hackathon',
        'status' => AssignmentStatus::active->value,
        'due_at' => now()->addDays(7),
      ]);
    } else {
      $assignment->update([
        'status' => AssignmentStatus::active->value,
      ]);
    }

    $batch = RegistrationBatch::query()
      ->where('status', RegistrationBatchStatus::active->value)
      ->first() ?? RegistrationBatch::query()->first();

    if (! $batch) {
      throw new \RuntimeException('Tidak ada registration batch yang tersedia.');
    }

    $participants = [
      [
        'email' => '23081010029@student.upnjatim.ac.id',
        'name' => 'Student 23081010029',
        'team_name' => 'Team 23081010029',
        'phone_number' => '081234567890',
        'requirement_link' => 'https://example.com/requirements/23081010029',
        'submission_link' => 'https://example.com/submission/23081010029',
      ],
      [
        'email' => 'umrajsyafiq@gmail.com',
        'name' => 'Umraj Syafiq',
        'team_name' => 'Team Umraj Syafiq',
        'phone_number' => '081234567891',
        'requirement_link' => 'https://example.com/requirements/umrajsyafiq',
        'submission_link' => 'https://example.com/submission/umrajsyafiq',
      ],
    ];

    foreach ($participants as $participant) {
      $user = User::firstOrCreate(
        ['email' => $participant['email']],
        [
          'name' => $participant['name'],
          'email_verified_at' => now(),
          'role' => UserRole::participant->value,
          'password' => Hash::make('password123'),
          'google_id' => null,
        ]
      );

      $user->update([
        'name' => $participant['name'],
        'email_verified_at' => now(),
        'role' => UserRole::participant->value,
        'password' => Hash::make('password123'),
      ]);

      $team = Team::firstOrCreate(
        [
          'leader_id' => $user->id,
          'competition_id' => $competition->id,
        ],
        [
          'team_name' => $participant['team_name'],
          'leader_name' => $user->name,
          'phone_number' => $participant['phone_number'],
          'institution' => 'UPN Veteran Jawa Timur',
          'requirement_link' => $participant['requirement_link'],
          'status' => TeamStatus::registered->value,
        ]
      );

      $team->update([
        'team_name' => $participant['team_name'],
        'leader_name' => $user->name,
        'phone_number' => $participant['phone_number'],
        'institution' => 'UPN Veteran Jawa Timur',
        'requirement_link' => $participant['requirement_link'],
        'status' => TeamStatus::registered->value,
      ]);

      $transaction = Transaction::firstOrCreate(
        ['team_id' => $team->id],
        [
          'amount' => 30000,
          'payment_method' => TransactionMethod::qris->value,
          'payment_proof_path' => 'transactions/' . str_replace(['@', '.'], '', $participant['email']) . '-proof.jpg',
          'status' => TransactionStatus::verified->value,
          'registration_batch_id' => $batch->id,
        ]
      );

      $transaction->update([
        'amount' => 30000,
        'payment_method' => TransactionMethod::qris->value,
        'payment_proof_path' => 'transactions/' . str_replace(['@', '.'], '', $participant['email']) . '-proof.jpg',
        'status' => TransactionStatus::verified->value,
        'registration_batch_id' => $batch->id,
      ]);

      AssignmentSubmission::firstOrCreate(
        [
          'assignment_id' => $assignment->id,
          'team_id' => $team->id,
        ],
        [
          'submission_link' => $participant['submission_link'],
        ]
      )->update([
        'submission_link' => $participant['submission_link'],
      ]);
    }
  }
}
