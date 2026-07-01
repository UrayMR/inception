<?php

namespace App\Utilities;

use Inertia\Support\SessionKey;

class FlashResponse
{
    private static function push(string $type, string $message): void
    {
        $session = request()->session();
        $flashed = $session->get(SessionKey::FLASH_DATA, []);
        $toasts = $flashed['toasts'] ?? [];

        $toasts[] = [
            'type' => $type,
            'message' => $message,
        ];

        $session->flash(SessionKey::FLASH_DATA, [
            ...$flashed,
            'toasts' => $toasts,
        ]);
    }

    public static function success(string $message): void
    {
        self::push('success', $message);
    }

    public static function info(string $message): void
    {
        self::push('info', $message);
    }

    public static function error(string $message): void
    {
        self::push('error', $message);
    }
}
