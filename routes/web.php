<?php

use App\Http\Controllers\Panel\CompetitionController as AdminCompetitionController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'guest/main', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'panel/dashboard')->name('dashboard');

    Route::resource('users', UserController::class)->names('users');
    Route::resource('competitions', AdminCompetitionController::class)->names('admin.competitions');
    Route::resource('teams', TeamController::class)->names('teams');

    Route::patch('transactions/verify/{transaction}', [TransactionController::class, 'verify'])->name('transactions.verify');
    Route::patch('transactions/reject/{transaction}', [TransactionController::class, 'reject'])->name('transactions.reject');
    Route::resource('transactions', TransactionController::class)->names('transactions');

    Route::inertia('/form-pendaftaran-lomba', 'participant/form-pendaftaran-lomba')->name('lomba');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
