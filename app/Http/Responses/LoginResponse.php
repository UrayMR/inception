<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
  public function toResponse($request)
  {
    $user = $request->user();

    if ($user->role === UserRole::admin->value || $user->role === UserRole::accountant->value) {
      return redirect()->intended(route('panel.dashboard'));
    }

    return redirect()->intended(route('home'));
  }
}
