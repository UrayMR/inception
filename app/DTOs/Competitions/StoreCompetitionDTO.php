<?php

namespace App\DTOs\Competitions;

use Illuminate\Http\UploadedFile;

class StoreCompetitionDTO
{
    public function __construct(
        public string $name,
        public ?string $description,
        public string $type,
        public ?UploadedFile $image_file,
        public ?float $price,
        public string $status,
    ) {}
}
