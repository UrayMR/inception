<?php

namespace App\Models;

use Database\Factories\CompetitionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competition extends Model
{
    /** @use HasFactory<CompetitionFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the route key for the model.
     *
     * @return string The route key for the model refers to column name in the database.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected $fillable = [
        'name',
        'description',
        'slug',
        'type',
        'max_member',
        'image_path',
        'price',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'float',
            'max_member' => 'integer',
        ];
    }

    public function timelines()
    {
        return $this->hasMany(CompetitionTimeline::class);
    }
}
