<?php

namespace App\Actions\Announcements;

use App\DTOs\Announcements\AnnouncementDTO;
use App\Models\Announcement;
use App\Repositories\Announcements\AnnouncementRepository;

class UpdateAnnouncement
{
  public function __construct(
    protected AnnouncementRepository $announcementRepository,
  ) {}

  public function handle(AnnouncementDTO $dto, Announcement $announcement): Announcement
  {
    $attributes = [
      'message' => $dto->message,
      'status' => $dto->status,
    ];

    return $this->announcementRepository->update($attributes, $announcement);
  }
}
