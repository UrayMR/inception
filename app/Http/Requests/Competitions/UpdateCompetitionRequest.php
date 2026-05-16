<?php

namespace App\Http\Requests\Competitions;

use App\DTOs\Competitions\Timelines\TimelineDTO;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Competition;
use App\DTOs\Competitions\UpdateCompetitionDTO;
use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;

class UpdateCompetitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('update', $this->route('competition'));
  }

  public function rules(): array
  {
    $competitionId = $this->route('competition')?->id;

    $competitionRules = [
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'slug' => ['required', 'string', 'max:255', Rule::unique('competitions', 'slug')->ignore($competitionId)],
      'type' => ['required', 'string', Rule::in(CompetitionType::cases())],
      'image_file' => ['nullable', 'file', 'image', 'max:2048'], // Max 2MB
      'image_path' => ['nullable', 'string', 'max:255'],
      'price' => ['nullable', 'numeric', 'min:0'],
      'status' => ['required', 'string', Rule::in(CompetitionStatus::cases())],
    ];

    $timelineRules = [
      'timelines' => ['sometimes', 'array'],
      'timelines.*.timeline_name' => ['required_with:timelines', 'string', 'max:255'],
      'timelines.*.description' => ['nullable', 'string'],
      'timelines.*.sequence' => ['required_with:timelines', 'integer'],
      'timelines.*.start_at' => ['required_with:timelines', 'date'],
      'timelines.*.end_at' => ['required_with:timelines', 'date', 'after:timelines.*.start_at'],
    ];

    return array_merge($competitionRules, $timelineRules);
  }

  public function toDTO(): UpdateCompetitionDTO
  {
    $timelines = TimelineDTO::collection($this->input('timelines', []));

    return new UpdateCompetitionDTO(
      name: $this->input('name'),
      description: $this->input('description'),
      slug: $this->input('slug'),
      type: $this->input('type'),
      image_file: $this->file('image_file'),
      image_path: $this->input('image_path'),
      price: $this->input('price'),
      status: $this->input('status'),
      timelines: $timelines,
    );
  }

  /**
   * Competition DTO without timelines collection
   * 
   * @return UpdateCompetitionDTO
   */
  public function toCompetitionDTO(): UpdateCompetitionDTO
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
