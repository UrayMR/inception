<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
  /**
   * Show the user's dashboard settings page.
   */
  public function index(): Response
  {
    $user = Auth::user();
    $team = $user?->team;
    $competition = $team?->competition;

    return Inertia::render('settings/dashboard', [
      'competition' => $competition,
      'schedule' => $competition?->timelines,
      'transaction' => $team?->transactions()->latest()->first(),
    ]);
  }
}
