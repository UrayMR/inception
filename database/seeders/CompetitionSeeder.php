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
                'start_at' => Carbon::create(2026, 8, 24, 0, 0, 0),
                'end_at'   => Carbon::create(2026, 9, 3, 23, 59, 59),
            ],
            'Technical Meeting' => [
                'sequence' => 2,
                'start_at' => Carbon::create(2026, 9, 4, 9, 0, 0),
                'end_at'   => Carbon::create(2026, 9, 4, 12, 0, 0),
            ],
            'Final Round' => [
                'sequence' => 5,
                'start_at' => Carbon::create(2026, 10, 10, 9, 0, 0),
                'end_at'   => Carbon::create(2026, 10, 10, 12, 0, 0),
            ],
            'Winner Announcement' => [
                'sequence' => 6,
                'start_at' => Carbon::create(2026, 10, 13, 16, 0, 0),
                'end_at'   => Carbon::create(2026, 10, 13, 17, 0, 0),
            ],
        ];

        // Submission starts right after Technical Meeting ends for every competition.
        $submissionStart = Carbon::create(2026, 9, 4, 12, 0, 0);

        $competitions = [
            'Essay' => [
                'description' => 'Dalam dunia yang terus berkembang, ide-ide inovatif menjadi kunci untuk menghadapi tantangan global. Essay Competition mengajak kamu untuk mengekspresikan pemikiran kritis dan kreatif melalui tulisan yang mendalam. Tunjukkan kemampuan analisis, argumentasi, dan solusi yang relevan terhadap isu-isu terkini, serta buktikan bahwa kata-kata dapat menginspirasi perubahan.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 3,
                        'start_at' => $submissionStart,
                        'end_at'   => Carbon::create(2026, 9, 16, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 4,
                        'start_at' => Carbon::create(2026, 9, 21, 16, 0, 0),
                        'end_at'   => Carbon::create(2026, 9, 21, 17, 0, 0),
                    ],
                ],
                'status' => CompetitionStatus::closed->value,
                'image_path' => 'competitions/essay.svg',
                'keywords' => "Essay, Writing, Critical Thinking, Creativity, Problem Solving, Research, Analysis, Argumentation, Communication Skills, lomba esai, essay competition, lomba menulis esai, lomba menulis kreatif"
            ],
            'Business Plan' => [
                'description' => 'Ide yang hebat tidak akan berarti tanpa eksekusi dan strategi yang matang. Business Plan Competition menantang kamu untuk merangkai ide tersebut menjadi model bisnis yang inovatif, realistis, dan menjawab kebutuhan pasar. Dari melihat peluang hingga menyusun strategi keuangan, buktikan bahwa rancangan bisnismu bukan sekadar konsep, melainkan solusi nyata yang siap bersaing dan memberikan dampak.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 3,
                        'start_at' => $submissionStart,
                        'end_at'   => Carbon::create(2026, 9, 18, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 4,
                        'start_at' => Carbon::create(2026, 9, 24, 16, 0, 0),
                        'end_at'   => Carbon::create(2026, 9, 24, 17, 0, 0),
                    ],
                ],
                'image_path' => 'competitions/business_plan.svg',
                'keywords' => "Business Plan, Innovation, Strategy, Customer Satisfaction, Market Analysis, Business Model, Business Process, Business Solution, lomba business plan, business plan competition, BPC, kewirausahaan, entrepreneurship, business strategy, model bisnis, rancangan bisnis, startup, inovasi bisnis, pitch deck."
            ],
            'UI/UX' => [
                'slug' => 'ui-ux',
                'description' => 'Setiap desain yang hebat berawal dari pemahaman terhadap kebutuhan pengguna. UI/UX Design Competition menantang peserta untuk merancang solusi digital yang inovatif, intuitif, dan berorientasi pada pengalaman pengguna dalam menjawab berbagai permasalahan nyata. Saatnya buktikan kreativitasmu melalui desain yang tidak hanya menarik, tetapi juga memberikan dampak.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 3,
                        'start_at' => $submissionStart,
                        'end_at'   => Carbon::create(2026, 9, 23, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 4,
                        'start_at' => Carbon::create(2026, 9, 29, 16, 0, 0),
                        'end_at'   => Carbon::create(2026, 9, 29, 17, 0, 0),
                    ],
                ],
                'image_path' => 'competitions/ui_ux.svg',
                'keywords' => "lomba UI/UX, UI/UX Design Competition, UI/UX Design, user interface, user experience, design thinking, product design, prototype design, user-centered design, interaction design, visual design, usability testing, wireframing, mockup design"
            ],
            'Data Science' => [
                'description' => 'Mencari pola dari ribuan data, membuat model prediktif, dan menyiapkan strategi yang tepat. Data Science Competition merupakan bidang kompetisi yang berfokus dalam pengolahan data untuk menghasilkan solusi yang relevan dengan permasalahan. Tunjukkan strategi dan inovasi yang kamu miliki untuk bersaing dalam Data Science Competition.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 3,
                        'start_at' => $submissionStart,
                        'end_at'   => Carbon::create(2026, 9, 24, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 4,
                        'start_at' => Carbon::create(2026, 9, 30, 16, 0, 0),
                        'end_at'   => Carbon::create(2026, 9, 30, 17, 0, 0),
                    ],
                ],
                'image_path' => 'competitions/data_science.svg',
                'keywords' => "Data Science, Machine Learning, Artificial Intelligence, Data Analysis, Predictive Modeling, Data Visualization, Big Data, lomba data sains, data science competition, data science, lomba analisis, lomba kecerdasan buatan, machine learning competition"
            ],
            'Hackathon' => [
                'description' => 'Siap membuktikan kemampuanmu? Tantang dirimu dalam Hackathon dan bangun solusi digital inovatif hanya dalam 24 jam secara online. Tuangkan ide terbaikmu, kolaborasikan kreativitas dan teknologi, lalu ciptakan aplikasi web yang mampu memberikan dampak serta menyelesaikan permasalahan nyata di masyarakat.',
                'type' => CompetitionType::team->value,
                'max_member' => 4,
                'custom_timelines' => [
                    'Submission' => [
                        'sequence' => 3,
                        'start_at' => $submissionStart,
                        'end_at'   => Carbon::create(2026, 9, 25, 23, 59, 59),
                    ],
                    'Finalist Announcement' => [
                        'sequence' => 4,
                        'start_at' => Carbon::create(2026, 10, 1, 16, 0, 0),
                        'end_at'   => Carbon::create(2026, 10, 1, 17, 0, 0),
                    ],
                ],
                'image_path' => 'competitions/hackathon.svg',
                'keywords' => "Hackathon, Innovation, Full-Stack Web Development, Problem Solving, Collaboration, Prototype, Digital Solution"
            ],
        ];

        foreach ($competitions as $name => $details) {
            $competition = Competition::factory()->create([
                'name' => $name,
                'slug' => $details['slug'] ?? strtolower(str_replace(' ', '-', $name)),
                'description' => $details['description'],
                'type' => $details['type'],
                'max_member' => $details['max_member'],
                'status' => $details['status'] ?? CompetitionStatus::open->value,
                'image_path' => $details['image_path'],
                'keywords' => $details['keywords'] ?? null,
                'guidebook_link' => $details['guidebook_link'] ?? "https://himatifaupnvjt.org/",
            ]);

            $allTimelines = [
                'Registration'          => $commonTimelines['Registration'],
                'Technical Meeting'     => $commonTimelines['Technical Meeting'],
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
