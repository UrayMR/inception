<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
  /**
   * Handle an incoming request.
   */
  public function handle(Request $request, Closure $next, string ...$roles): Response
  {
    $allowedRoles = array_map(
      fn(string $role): string => UserRole::tryFrom($role)?->value ?? abort(403),
      $roles
    );

    $user = $request->user();

    if (! $user || ! in_array($user->role, $allowedRoles, true)) {
      abort(403);
    }

    return $next($request);
  }
}
