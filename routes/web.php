<?php

use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeamController;

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'guest/main', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'panel/dashboard')->name('dashboard');

    Route::resource('users', UserController::class)->names('users');
    Route::resource('competitions', CompetitionController::class)->names('competitions');
    Route::resource('teams', TeamController::class)->names('teams');

    Route::inertia('/form-pendaftaran-lomba', 'participant/form-pendaftaran-lomba')->name('lomba');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
