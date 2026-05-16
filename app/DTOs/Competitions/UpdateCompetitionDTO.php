<?php

namespace App\DTOs\Competitions;

use Illuminate\Http\UploadedFile;

class UpdateCompetitionDTO
{
  public function __construct(
    public string $name,
    public ?string $description,
    public string $slug,
    public string $type,
    public ?UploadedFile $image_file,
    public ?string $image_path,
    public ?float $price,
    public string $status,

    // TODO: This should be a collection of TimelineDTOs, but for simplicity, we'll keep it as an array for now.
    public array $timelines,
  ) {}
}
