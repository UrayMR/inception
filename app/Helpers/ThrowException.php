<?php

namespace App\Helpers;

use App\Exceptions\BusinessException;
use Illuminate\Validation\ValidationException;
use RuntimeException;

/**
 * @method static never validation(string $field, string $message)
 * @method static never business(string $message, int $status = 422)
 * @method static never runtime(string $message)
 */
class ThrowException
{
  public static function validation(string $field, string $message): never
  {
    throw ValidationException::withMessages([
      $field => $message,
    ]);
  }

  public static function business(string $message, int $status = 422): never
  {
    throw new BusinessException($message, $status);
  }

  public static function runtime(string $message): never
  {
    throw new RuntimeException($message);
  }
}
