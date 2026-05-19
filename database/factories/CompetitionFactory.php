<?php

namespace Database\Factories;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Competition>
 */
class CompetitionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->sentence(3);

        return [
            'name' => $name,
            'description' => $this->faker->optional()->paragraph(),
            'slug' => Str::slug($name),
            'type' => $this->faker->randomElement(CompetitionType::cases()),
            'image_path' => $this->faker->optional()->imageUrl(),
            'price' => $this->faker->randomFloat(2, 0, 1000000),
            'status' => $this->faker->randomElement(CompetitionStatus::cases()),
        ];
    }
}
