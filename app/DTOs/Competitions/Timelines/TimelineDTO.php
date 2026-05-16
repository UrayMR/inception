<?php

namespace App\DTOs\Competitions\Timelines;

class TimelineDTO
{
  public function __construct(
    public string $competition_id,
    public string $timeline_name,
    public ?string $description,
    public int $sequence,
    public string $start_date,
    public string $end_date,
  ) {}

  /**
   * Convert an array of timeline data into an array of TimelineDTOs.
   * Called as collection but it's array! 
   * 
   * @param array $timelines An array of timeline data arrays.
   * @return array An array of TimelineDTO objects.
   */
  public static function collection(array $timelines): array
  {
    return array_map(function ($timeline) {
      return new self(
        competition_id: $timeline['competition_id'],
        timeline_name: $timeline['timeline_name'],
        description: $timeline['description'] ?? null,
        sequence: (int)($timeline['sequence'] ?? 0),
        start_date: $timeline['start_at'],
        end_date: $timeline['end_at'],
      );
    }, $timelines);
  }
}
