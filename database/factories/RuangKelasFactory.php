<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RuangKelas>
 */
class RuangKelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => 'Ruang ' . $this->faker->unique()->buildingNumber(),
            'gedung' => 'Gedung ' . $this->faker->word(),
            'lantai' => $this->faker->numberBetween(1, 3),
            'kapasitas' => $this->faker->randomElement([24, 48, 72]),
            'status' => $this->faker->randomElement(['layak', 'tidak_layak', 'perbaikan']),
        ];
    }
}
