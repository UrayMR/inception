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
    $competitionRules = [
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
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

  /**
   * Competition DTO
   * 
   * @return UpdateCompetitionDTO
   */
  public function toCompetitionDTO(): UpdateCompetitionDTO
  {
    return new UpdateCompetitionDTO(
      name: $this->input('name'),
      description: $this->input('description'),
      type: $this->input('type'),
      image_file: $this->file('image_file'),
      image_path: $this->input('image_path'),
      price: $this->input('price'),
      status: $this->input('status'),
    );
  }

  /**
   * Timeline DTO array
   * 
   * @param string $competition_id
   * @return array
   */
  public function toTimelineDTO(string $competition_id): array
  {
    $timelinesData = $this->input('timelines', []);

    return array_map(function ($timeline) use ($competition_id) {
      $dto = new TimelineDTO(
        competition_id: $competition_id,
        timeline_name: $timeline['timeline_name'],
        description: $timeline['description'] ?? null,
        sequence: $timeline['sequence'],
        start_at: $timeline['start_at'],
        end_at: $timeline['end_at'],
      );

      return $dto->toArray();
    }, $timelinesData);
  }
}
