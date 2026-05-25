<?php

use App\Http\Controllers\Guest\CompetitionController;
use App\Http\Controllers\Panel\CompetitionController as AdminCompetitionController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'guest/main', [
    // 'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'panel/dashboard')->name('dashboard');

    Route::resource('users', UserController::class)->names('users');
    Route::resource('admin/competitions', AdminCompetitionController::class)->names('admin.competitions');
    Route::resource('teams', TeamController::class)->names('teams');

    Route::patch('transactions/verify/{transaction}', [TransactionController::class, 'verify'])->name('transactions.verify');
    Route::patch('transactions/reject/{transaction}', [TransactionController::class, 'reject'])->name('transactions.reject');
    Route::resource('transactions', TransactionController::class)->names('transactions');

    Route::get('competitions', [CompetitionController::class, 'index'])->name('competitions.index');
    Route::get('competitions/{competition}', [CompetitionController::class, 'show'])->name('competitions.show');

    // Route::get('competitions/register', [CompetitionController::class, 'register'])->name('competitions.register');
    // Route::post('competitions/register', [CompetitionController::class, 'store'])->name('competitions.register.store');

    Route::controller(CompetitionController::class)->group(function () {
        Route::get('test/register', 'register')->name('competitions.register');
        Route::post('test/register', 'store')->name('competitions.register.store');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
