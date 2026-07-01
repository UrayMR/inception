<?php

namespace App\Exceptions;

use App\Utilities\FlashResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class GlobalException
{
  /**
   * Log all exceptions with detailed context and stack trace 
   * Except for BusinessException which is handled differently
   */
  public function report(Throwable $e): void
  {
    if ($e instanceof BusinessException) {
      return;
    }

    $context = [
      'error' => $e->getMessage(),
      'trace' => $e->getTraceAsString(),
    ];

    if (app()->bound('request')) {
      $request = app(Request::class);

      $context['url'] = $request->fullUrl();
      $context['input'] = $request->all();
    }

    Log::error('Exception caught', $context);
  }

  /**
   * Determine when to render JSON responses for exceptions
   */
  public function shouldRenderJsonWhen(Request $request, Throwable $e): bool
  {
    return $request->is('api/*') || $request->expectsJson();
  }

  /**
   * Render JSON responses for exceptions based on their type and context
   * For API requests or when the client expects JSON, return structured JSON responses.
   * For non-API requests, return null to allow Inertia to handle the response.
   */
  public function render(Throwable $e, Request $request): ?Response
  {
    if ($e instanceof BusinessException) {

      if ($request->expectsJson()) {
        return response()->json([
          'success' => false,
          'message' => $e->getMessage(),
        ], $e->status());
      }

      FlashResponse::error($e->getMessage());

      return back();
    }

    if (! $request->is('api/*') && ! $request->expectsJson()) {
      return null;
    }

    if ($e instanceof ValidationException) {
      return response()->json([
        'success' => false,
        'message' => 'Validasi gagal.',
        'errors' => $e->errors(),
      ], 422);
    }

    if ($e instanceof AuthorizationException) {
      return response()->json([
        'success' => false,
        'message' => 'Tidak diizinkan.',
      ], 403);
    }

    if ($e instanceof AuthenticationException) {
      return response()->json([
        'success' => false,
        'message' => 'Belum login.',
      ], 401);
    }

    if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
      return response()->json([
        'success' => false,
        'message' => 'Data tidak ditemukan.',
      ], 404);
    }

    if ($e instanceof HttpException) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage() ?: 'HTTP error.',
      ], $e->getStatusCode());
    }

    return response()->json([
      'success' => false,
      'message' => 'Server error.',
    ], 500);
  }

  /**
   * For Non API requests, rendering fallback error page with Inertia
   */
  public function respond(Response $response): Response
  {
    $request = app(Request::class);

    if ($request->is('api/*') || $request->expectsJson()) {
      return $response;
    }

    return match ($response->getStatusCode()) {
      403, 404, 419, 429, 500, 503
      => $this->renderErrorPage(
        $request,
        $response->getStatusCode()
      ),

      default => $response,
    };
  }

  /**
   * Render fallback error page with Inertia
   */
  private function renderErrorPage(Request $request, int $status): Response
  {
    return Inertia::render('errors/error-page', [
      'error' => $this->getErrorData($status),
    ])->toResponse($request)->setStatusCode($status);
  }

  /**
   * Get error data based on status code
   */
  private function getErrorData(int $status): array
  {
    return match ($status) {
      403 => [
        'status' => 403,
        'title' => 'Akses Ditolak',
        'description' => 'Anda tidak memiliki izin untuk mengakses halaman ini.',
      ],

      404 => [
        'status' => 404,
        'title' => 'Halaman Tidak Ditemukan',
        'description' => 'Halaman yang Anda cari tidak tersedia.',
      ],

      419 => [
        'status' => 419,
        'title' => 'Sesi Berakhir',
        'description' => 'Silakan refresh halaman dan coba kembali.',
      ],

      429 => [
        'status' => 429,
        'title' => 'Terlalu Banyak Permintaan',
        'description' => 'Silakan tunggu beberapa saat sebelum mencoba lagi.',
      ],

      500 => [
        'status' => 500,
        'title' => 'Terjadi Kesalahan',
        'description' => 'Terjadi kesalahan pada server.',
      ],

      503 => [
        'status' => 503,
        'title' => 'Maintenance',
        'description' => 'Aplikasi sedang dalam pemeliharaan.',
      ],

      default => [
        'status' => $status,
        'title' => 'Terjadi Kesalahan',
        'description' => 'Terjadi kesalahan yang tidak diketahui.',
      ],
    };
  }
}
