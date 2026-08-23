<?php

namespace App\Repositories\Announcements;

use App\Models\Announcement;

interface AnnouncementRepository
{
  public function index(): Announcement;

  public function store(array $attributes): Announcement;

  public function update(array $attributes, Announcement $announcement): Announcement;
}
