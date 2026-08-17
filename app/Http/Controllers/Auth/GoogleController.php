<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\RedirectResponse;
use App\Services\Auth\GoogleAuthService;
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
    try {
      $user = $this->googleAuthService->authenticate();

      $this->flash('success', "Selamat datang, {$user->name}!");

      return redirect()->intended('/');
    } catch (Exception $e) {
      report($e);

      $this->flash('error', 'Ada masalah saat login. Silakan coba lagi.');

      return redirect()->route('login');
    }
  }
}
