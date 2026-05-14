<?php

namespace App\Utilities;

use Inertia\Inertia;

class FlashResponse
{
    public static function success(string $message)
    {
        return Inertia::flash('toast', ['type' => 'success', 'message' => $message]);
    }

    public static function info(string $message)
    {
        return Inertia::flash('toast', ['type' => 'info', 'message' => $message]);
    }

    public static function error(string $message)
    {
        return Inertia::flash('toast', ['type' => 'error', 'message' => $message]);
    }
}
