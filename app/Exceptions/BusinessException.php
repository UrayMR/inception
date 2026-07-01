<?php

namespace App\Exceptions;

use Exception;

class BusinessException extends Exception
{
  public function __construct(
    string $message,
    protected int $status = 422,
    protected string $type = 'error',
    ?Exception $previous = null,
  ) {
    parent::__construct($message, 0, $previous);
  }

  public function status(): int
  {
    return $this->status;
  }
}
