<?php

use App\Http\Controllers\Guest\CompetitionRegistrationController;
use App\Http\Controllers\Panel\CompetitionController;
use App\Http\Controllers\Panel\TeamController;
use App\Http\Controllers\Panel\TransactionController;
use App\Http\Controllers\Panel\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'guest/main', [
    // 'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::inertia('dashboard', 'panel/dashboard')->name('dashboard');
        Route::resource('users', UserController::class)->names('users');
        Route::resource('competitions', CompetitionController::class)->names('competitions');
        Route::resource('teams', TeamController::class)->names('teams');
    });

    Route::middleware('role:admin,accountant')->group(function () {
        Route::controller(TransactionController::class)->group(function () {
            Route::patch('transactions/verify/{transaction}', 'verify')->name('transactions.verify');
            Route::patch('transactions/reject/{transaction}', 'reject')->name('transactions.reject');
            Route::resource('transactions', TransactionController::class)->names('transactions');
        });
    });

    Route::controller(CompetitionRegistrationController::class)->group(function () {
        Route::get('competitions', 'index')->name('competitions.index');
        Route::get('competitions/{competition}', 'show')->name('competitions.show');
        Route::get('competitions/register', 'register')->name('competitions.register');
        Route::post('competitions/register', 'store')->name('competitions.register.store');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
