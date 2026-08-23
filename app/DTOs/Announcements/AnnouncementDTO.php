<?php

namespace App\DTOs\Announcements;

class AnnouncementDTO
{
  public function __construct(
    public string $message,
    public string $status,
  ) {}
}
