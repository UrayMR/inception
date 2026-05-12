<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/google/redirect', function () {
    Inertia::flash('toast', ['type' => 'info', 'message' => 'Redirecting to Google...']);

    return Socialite::driver('google')->redirect();
})->name('auth.google.redirect');

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
            ]);
        } else {
            $user = User::create([
                'google_id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'role' => User::ROLE_PARTICIPANT,
            ]);
        }

        Auth::login($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Login Success']);

        return redirect()->intended('/');
    } catch (Exception $e) {
        report($e);

        return redirect('/login')->with('error', 'Ada masalah saat login.');
    }
})->name('auth.google.callback');
