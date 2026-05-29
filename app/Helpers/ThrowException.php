<?php

namespace App\Helpers;

use Illuminate\Validation\ValidationException;
use RuntimeException;

class ThrowException
{
  public static function validation(string $field, string $message): never
  {
    throw ValidationException::withMessages([
      $field => $message,
    ]);
  }

  public static function runtime(string $message): never
  {
    throw new RuntimeException($message);
  }
}
