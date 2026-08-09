<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LogoutResponse implements LogoutResponseContract
{
  /**
   * Create an HTTP response that represents the given object.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return Response
   */
  public function toResponse($request): Response
  {
    if ($request->wantsJson()) {
      return new JsonResponse(['message' => 'Berhasil logout.'], 204);
    }

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Anda telah berhasil logout!',
    ]);

    return redirect('/');
  }
}
