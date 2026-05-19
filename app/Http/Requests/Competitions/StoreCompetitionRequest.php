<?php

namespace App\Http\Requests\Competitions;

use App\DTOs\Competitions\StoreCompetitionDTO;
use App\DTOs\Competitions\Timelines\TimelineDTO;
use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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

    /**
     * Competition DTO
     */
    public function toCompetitionDTO(): StoreCompetitionDTO
    {
        return new StoreCompetitionDTO(
            name: $this->input('name'),
            description: $this->input('description'),
            type: $this->input('type'),
            image_file: $this->file('image_file'),
            price: $this->input('price'),
            status: $this->input('status'),
        );
    }

    /**
     * Timeline DTO array
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
