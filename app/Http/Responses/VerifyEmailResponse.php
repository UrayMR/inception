<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
  public function toResponse($request)
  {
    $user = $request->user();

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => "Email Anda berhasil diverifikasi! Selamat datang, {$user->name}!",
    ]);

    return redirect()->intended(route('home'));
  }
}
