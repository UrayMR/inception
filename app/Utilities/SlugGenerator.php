<?php

namespace App\Utilities;

use Illuminate\Support\Str;

class SlugGenerator
{
    /**
     * Generate a URL-friendly slug from a given string.
     */
    public static function make(string $name, string $separator = '-'): string
    {
        return Str::slug($name, $separator);
    }
}
