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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
        ];
    }

    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }
}
