<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\RedirectResponse;
use App\Services\Auth\GoogleAuthService;
use Laravel\Socialite\Two\InvalidStateException;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleController extends Controller
{
  public function __construct(
    protected GoogleAuthService $googleAuthService,
  ) {}

  /**
   * Redirect the user to the Google OAuth page.
   */
  public function redirect(): SymfonyRedirectResponse
  {
    $this->flash('info', 'Redirecting to Google...');

    return $this->googleAuthService->redirect();
  }

  /**
   * Handle the Google OAuth callback.
   */
  public function callback(): RedirectResponse
  {
    if (request()->has('error')) {
      $this->flash('info', 'Login dibatalkan. Silakan coba lagi.');

      return redirect()->route('login');
    }

    try {
      $user = $this->googleAuthService->authenticate();

      $this->flash('success', "Selamat datang, {$user->name}!");

      return redirect()->intended('/');
    } catch (InvalidStateException $e) {
      $this->flash('error', 'Sesi login kedaluwarsa atau terblokir browser. Silakan coba lagi.');

      return redirect()->route('login');
    } catch (Exception $e) {
      report($e);

      $this->flash('error', 'Ada masalah saat login. Silakan coba lagi.');

      return redirect()->route('login');
    }
  }
}
