<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use App\Resources\Participant\Competitions\CompetitionListResource;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
  public function __invoke()
  {
    $competitions = Competition::query()
      ->orderByRaw("CASE WHEN name = 'Hackathon' THEN 0 ELSE 1 END")
      ->orderByDesc('status')
      ->get(['id', 'name', 'slug', 'description', 'status']);

    return Inertia::render('guest/main', [
      'canRegister' => Features::enabled(Features::registration()),
      'competitions' => CompetitionListResource::collection(
        $competitions
      ),
      'seo' => [
        'title' => 'INCEPTION 2026 - Code The Future Create The Impact',
        'description' => 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!',
        'index' => true,
        'keywords' => 'inception, inception 2026, code the future create the impact, kompetisi informatika, kompetisi nasional, kompetisi mahasiswa, kompetisi UI/UX, kompetisi Data Science, kompetisi Online Hackathon, kompetisi Business Plan Competition',
        'json-ld' => [
          [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'INCEPTION 2026 - Code The Future Create The Impact',
            'url' => 'https://inception.himatifaupnvjt.org',
            'description' => 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!',
            'publisher' => [
              '@type' => 'Organization',
              'name' => 'Inception',
              'logo' => 'https://inception.himatifaupnvjt.org/assets/svg/logo.svg',
              'sameAs' => ['https://instagram.com/inception'],
            ],
          ],
          [
            '@context' => 'https://schema.org',
            '@type' => 'Event',
            'name' => 'INCEPTION 2026 - Code The Future Create The Impact',
            'description' => 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!',
            'startDate'  => '2026-08-10T00:00:00+07:00',
            'endDate' => '2026-08-28T23:59:59+07:00',
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OnlineEventAttendanceMode',
            'location' => [
              '@type' => 'VirtualLocation',
              'url' => 'https://inception.himatifaupnvjt.org',
            ],
            'organizer' => [
              '@type' => 'Organization',
              'name' => 'HIMATIFA UPNVJT',
              'url' => 'https://inception.himatifaupnvjt.org',
            ],
            'image' => 'https://inception.himatifaupnvjt.org/assets/png/seo/seo-thumbnail.png',
          ],
        ],
      ],
    ]);
  }
}
