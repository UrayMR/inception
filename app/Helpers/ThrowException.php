<?php

namespace App\Helpers;

use Illuminate\Validation\ValidationException;

class ThrowException
{
  public static function validation(string $field, string $message): never
  {
    throw ValidationException::withMessages([
      $field => $message,
    ]);
  }
}