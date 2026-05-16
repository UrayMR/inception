<?php

namespace App\Models;

use Database\Factories\CompetitionTimelineFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionTimeline extends Model
{
  /** @use HasFactory<CompetitionTimelineFactory> */
  use HasFactory, HasUuids;

  protected $fillable = [
    'competition_id',
    'timeline_name',
    'description',
    'sequence',
    'start_at',
    'end_at',
  ];

  public function competition()
  {
    return $this->belongsTo(Competition::class);
  }
}
