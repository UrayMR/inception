<?php

namespace App\Utilities;

use Illuminate\Support\Str;

class SlugGenerator
{
  /**
   * Generate a URL-friendly slug from a given string.
   *
   * @param string $name
   * @param string $separator
   * @return string
   */
  public static function make(string $name, string $separator = '-'): string
  {
    return Str::slug($name, $separator);
  }
}
