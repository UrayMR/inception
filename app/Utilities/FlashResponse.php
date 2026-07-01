<?php

namespace App\Utilities;

use Inertia\Inertia;

class FlashResponse
{
    public static function make(string $type, string $message): void
    {
        Inertia::flash('toast', [
            'type' => $type,
            'message' => $message,
        ]);
    }

    public static function success(string $message): void
    {
        self::make('success', $message);
    }

    public static function info(string $message): void
    {
        self::make('info', $message);
    }

    public static function error(string $message): void
    {
        self::make('error', $message);
    }
}
