<?php

use App\Exceptions\GlobalException;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $handler = app(GlobalException::class);

        // Log all exceptions with detailed context and stack trace
        $exceptions->report(fn(Throwable $e) => $handler->report($e))->stop();

        // Determine when to render JSON responses for exceptions
        $exceptions->shouldRenderJsonWhen(fn($request, Throwable $e) => $handler->shouldRenderJsonWhen($request, $e));

        // API or JSON request exceptions will be rendered as JSON responses, while others will fall back to default rendering
        $exceptions->render(fn(Throwable $e, $request) => $handler->render($e, $request));

        // For Non API requests, rendering fallback error page with Inertia
        $exceptions->respond(fn($response) => $handler->respond($response));
    })->create();
