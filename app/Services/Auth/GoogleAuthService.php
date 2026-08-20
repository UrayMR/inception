<?php

namespace App\Services\Auth;

use App\Actions\Auth\SyncGoogleUser;
use App\DTOs\Auth\GoogleUserDTO;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleAuthService
{
  public function __construct(
    protected SyncGoogleUser $syncGoogleUser,
  ) {}

  public function redirect(): SymfonyRedirectResponse
  {
    return Socialite::driver('google')->redirect();
  }

  public function authenticate(): User
  {
    $googleUser = Socialite::driver('google')->user();

    $user = $this->syncGoogleUser->handle(new GoogleUserDTO(
      googleId: $googleUser->getId(),
      name: $googleUser->getName(),
      email: $googleUser->getEmail(),
    ));

    Auth::login($user);

    return $user;
  }
}
