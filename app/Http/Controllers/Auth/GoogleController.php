<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleController extends Controller
{
  /**
   * Redirect the user to the Google OAuth page.
   */
  public function redirect(): SymfonyRedirectResponse
  {
    $this->flash('info', 'Redirecting to Google...');

    return Socialite::driver('google')->redirect();
  }

  /**
   * Handle the Google OAuth callback.
   */
  public function callback(): RedirectResponse
  {
    try {
      $googleUser = Socialite::driver('google')->user();

      $user = User::where('google_id', $googleUser->getId())
        ->orWhere('email', $googleUser->getEmail())
        ->first();

      if ($user) {
        $user->update([
          'google_id' => $googleUser->getId(),
          'name' => $googleUser->getName(),
          'email_verified_at' => $user->email_verified_at ?? now(),
        ]);
      } else {
        $user = User::create([
          'google_id' => $googleUser->getId(),
          'name' => $googleUser->getName(),
          'email' => $googleUser->getEmail(),
          'role' => UserRole::participant->value,
          'email_verified_at' => now(),
        ]);
      }

      Auth::login($user);

      $this->flash('success', 'Selamat datang, ' . $user->name . '!');

      return redirect()->intended('/');
    } catch (Exception $e) {
      report($e);

      $this->flash('error', 'Ada masalah saat login. Silakan coba lagi.');

      return redirect()->route('login');
    }
  }
}
