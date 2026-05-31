<?php

namespace App\DTOs\Competitions;

use Illuminate\Http\UploadedFile;

class UpdateCompetitionDTO
{
    public function __construct(
        public string $name,
        public ?string $description,
        public string $type,
        public ?UploadedFile $image_file,
        public ?string $image_path,
        public ?float $price,
        public string $status,
        public ?int $max_member,
    ) {}
}
