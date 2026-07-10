<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use App\Resources\Participant\Competitions\CompetitionListResource;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
  public function __invoke()
  {
    return Inertia::render('guest/main', [
      'canRegister' => Features::enabled(Features::registration()),
      'competitions' => CompetitionListResource::collection(
        Competition::all()
      ),
    ]);
  }
}
