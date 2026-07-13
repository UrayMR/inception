<?php

namespace App\Models;

use Database\Factories\AssignmentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    /** @use HasFactory<AssignmentFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'competition_id',
        'name',
        'status',
        'due_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
        ];
    }

    public function competitions()
    {
        return $this->belongsTo(Competition::class);
    }
}
