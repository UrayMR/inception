<?php

namespace App\DTOs\Batches;

class RegistrationBatchDTO
{
  public function __construct(
    public string $name,
    public string $status,
  ) {}
}
