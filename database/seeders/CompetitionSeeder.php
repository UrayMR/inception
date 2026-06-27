<?php

namespace Database\Seeders;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        $commonTimelines = [
            'Registration' => [
                'sequence' => 1,
                'start_at' => Carbon::create(2026, 7, 1, 0, 0, 0),
                'end_at'   => Carbon::create(2026, 7, 14, 23, 59, 59),
            ],
            'Final Round' => [
                'sequence' => 4,
                'start_at' => Carbon::create(2026, 8, 20, 0, 0, 0),
                'end_at'   => Carbon::create(2026, 8, 20, 17, 0, 0),
            ],
            'Winner Announcement' => [
                'sequence' => 5,
                'start_at' => Carbon::create(2026, 8, 25, 19, 0, 0),
                'end_at'   => Carbon::create(2026, 8, 25, 21, 0, 0),
            ],
        ];

        $competitions = [
            'Essay' => [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 2,
                        'start_at' => Carbon::create(2026, 7, 15, 0, 0, 0),
                        'end_at'   => Carbon::create(2026, 7, 25, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 3,
                        'start_at' => Carbon::create(2026, 8, 1, 10, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 1, 23, 59, 59),
                    ],
                ],
            ],
            'Business Plan' => [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 2,
                        'start_at' => Carbon::create(2026, 7, 15, 0, 0, 0),
                        'end_at'   => Carbon::create(2026, 7, 30, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 3,
                        'start_at' => Carbon::create(2026, 8, 5, 10, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 5, 23, 59, 59),
                    ],
                ],
            ],
            'UI/UX' => [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 2,
                        'start_at' => Carbon::create(2026, 7, 15, 0, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 2, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 3,
                        'start_at' => Carbon::create(2026, 8, 10, 10, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 10, 23, 59, 59),
                    ],
                ],
            ],
            'Data Science' => [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 2,
                        'start_at' => Carbon::create(2026, 7, 15, 0, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 5, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 3,
                        'start_at' => Carbon::create(2026, 8, 12, 10, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 12, 23, 59, 59),
                    ],
                ],
            ],
            'Hackathon' => [
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 2,
                        'start_at' => Carbon::create(2026, 7, 15, 0, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 10, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 3,
                        'start_at' => Carbon::create(2026, 8, 15, 10, 0, 0),
                        'end_at'   => Carbon::create(2026, 8, 15, 23, 59, 59),
                    ],
                ],
            ],
        ];

        foreach ($competitions as $name => $details) {
            $competition = Competition::factory()->create([
                'name' => $name,
                'description' => $details['description'],
                'type' => $details['type'],
                'max_member' => $details['max_member'],
                'status' => fake()->randomElement([
                    CompetitionStatus::open->value,
                    CompetitionStatus::closed->value,
                ]),
            ]);

            $allTimelines = [
                'Registration'          => $commonTimelines['Registration'],
                'Submission'            => $details['custom_timelines']['Submission'],
                'Finalist Announcement' => $details['custom_timelines']['Finalist Announcement'],
                'Final Round'           => $commonTimelines['Final Round'],
                'Winner Announcement'   => $commonTimelines['Winner Announcement'],
            ];

            foreach ($allTimelines as $timelineName => $timeData) {
                CompetitionTimeline::factory()
                    ->for($competition)
                    ->create([
                        'timeline_name'     => $timelineName,
                        'sequence' => $timeData['sequence'],
                        'start_at' => $timeData['start_at'],
                        'end_at'   => $timeData['end_at'],
                    ]);
            }
        }
    }
}
