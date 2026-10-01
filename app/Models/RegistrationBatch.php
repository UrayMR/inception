<?php

namespace App\Models;

use Database\Factories\RegistrationBatchesFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationBatch extends Model
{
    /** @use HasFactory<RegistrationBatchesFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'status',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
