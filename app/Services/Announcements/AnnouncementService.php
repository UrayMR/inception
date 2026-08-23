<?php

namespace App\Services\Announcements;

use App\Repositories\Announcements\AnnouncementRepository;
use App\Actions\Announcements\StoreAnnouncement;
use App\Actions\Announcements\UpdateAnnouncement;
use App\DTOs\Announcements\AnnouncementDTO;
use Illuminate\Support\Facades\DB;
use App\Models\Announcement;
use Illuminate\Support\Facades\Cache;

class AnnouncementService
{
  public function __construct(
    protected AnnouncementRepository $announcementRepository,
    protected StoreAnnouncement $storeAnnouncement,
    protected UpdateAnnouncement $updateAnnouncement,
  ) {}

  public function index()
  {
    return $this->announcementRepository->index();
  }

  public function store(AnnouncementDTO $dto)
  {
    DB::transaction(function () use ($dto) {
      $this->storeAnnouncement->handle($dto);
    });
  }

  public function update(AnnouncementDTO $dto, Announcement $announcement)
  {
    DB::transaction(function () use ($dto, $announcement) {
      $this->updateAnnouncement->handle($dto, $announcement);

      Cache::forget('announcement');
    });
  }
}
