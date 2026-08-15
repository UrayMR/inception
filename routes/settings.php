<?php

use App\Http\Controllers\Settings\SubmissionController;
use App\Http\Controllers\Settings\DashboardController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->as('settings.')->prefix('settings')->group(function () {
    Route::redirect('/', 'settings/dashboard')->name('main');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/assignments/{assignment}/submissions', [SubmissionController::class, 'store'])
        ->name('assignments.submissions.store');

    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])
        ->name('transactions.show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::middleware(['verified'])->group(function () {
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('/security', [SecurityController::class, 'edit'])->name('security.edit');

        Route::put('/password', [SecurityController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('user-password.update');
    });
});
