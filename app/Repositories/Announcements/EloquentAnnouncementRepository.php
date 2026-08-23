<?php

namespace App\Repositories\Announcements;

use App\Models\Announcement;
use App\Repositories\Announcements\AnnouncementRepository;

class EloquentAnnouncementRepository implements AnnouncementRepository
{
  public function index(): Announcement
  {
    $query = Announcement::latest()->first();

    return $query;
  }

  /**
   * @param  array  $attributes  (data sent from form)
   */
  public function store(array $attributes): Announcement
  {
    return Announcement::create($attributes);
  }

  /**
   * @param  array  $attributes  (data sent from form)
   * @param  Announcement  $announcement  (to be updated)
   */
  public function update(array $attributes, Announcement $announcement): Announcement
  {
    $announcement->update($attributes);

    return $announcement;
  }
}
