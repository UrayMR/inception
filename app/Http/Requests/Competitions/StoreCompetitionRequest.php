<?php

namespace App\Http\Requests\Competitions;

use App\Enums\CompetitionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Competition;
use App\DTOs\Competitions\StoreCompetitionDTO;
use App\DTOs\Competitions\Timelines\TimelineDTO;
use App\Enums\CompetitionType;

class StoreCompetitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create', Competition::class);
  }

  public function rules(): array
  {
    $competitionRules = [
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'slug' => ['required', 'string', 'max:255', 'unique:competitions,slug'],
      'type' => ['required', 'string', Rule::in(CompetitionType::cases())],
      'image_file' => ['nullable', 'file', 'image', 'max:2048'], // Max 2MB
      'price' => ['nullable', 'numeric', 'min:0'],
      'status' => ['required', 'string', Rule::in(CompetitionStatus::cases())],
    ];

    $timelineRules = [
      'timelines' => ['required', 'array', 'min:1'],
      'timelines.*.timeline_name' => ['required', 'string', 'max:255'],
      'timelines.*.description' => ['nullable', 'string'],
      'timelines.*.sequence' => ['required', 'integer'],
      'timelines.*.start_at' => ['required', 'date'],
      'timelines.*.end_at' => ['required', 'date', 'after:timelines.*.start_at'],
    ];

    return array_merge($competitionRules, $timelineRules);
  }

  public function toDTO(): StoreCompetitionDTO
  {
    $timelines = TimelineDTO::collection($this->input('timelines', []));

    return new StoreCompetitionDTO(
      name: $this->input('name'),
      description: $this->input('description'),
      slug: $this->input('slug'),
      type: $this->input('type'),
      image_file: $this->file('image_file'),
      price: $this->input('price'),
      status: $this->input('status'),
      timelines: $timelines,
    );
  }

  /**
   * Competition DTO without timelines collection
   * 
   * @return StoreCompetitionDTO
   */
  public function toCompetitionDTO(): StoreCompetitionDTO
  {
    $dto = $this->toDTO();

    unset($dto->timelines); // Remove timelines from the main DTO, as they will be handled separately

    return $dto;
  }

  /**
   * Timeline DTO collection
   * 
   * @return array
   */
  public function toTimelineDTO(): array
  {
    return $this->toDTO()->timelines; // Return only the timelines part as an array of TimelineDTOs
  }
}
