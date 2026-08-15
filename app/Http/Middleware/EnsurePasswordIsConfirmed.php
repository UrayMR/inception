<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordIsConfirmed
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $requiresConfirm = Features::canManageTwoFactorAuthentication()
            && Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword');

        if (! $requiresConfirm || empty($user?->password)) {
            return $next($request);
        }

        return app(RequirePassword::class)->handle($request, $next);
    }
}
