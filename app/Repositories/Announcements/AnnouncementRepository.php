<?php

namespace App\Repositories\Announcements;

use App\Models\Announcement;

interface AnnouncementRepository
{
  public function index(): array;

  public function store(array $attributes): Announcement;

  public function update(array $attributes, Announcement $announcement): Announcement;
}
