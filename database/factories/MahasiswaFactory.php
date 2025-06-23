<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nim' => fake()->unique()->numerify('##########'),
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telepon' => fake()->phoneNumber(),
            'alamat' => fake()->address(),
        ];
    }
}
