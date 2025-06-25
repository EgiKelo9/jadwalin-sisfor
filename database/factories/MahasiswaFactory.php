<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\User;
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
            'status' => fake()->randomElement(['aktif', 'nonaktif']),
        ];
    }

    public function withAccount($count = 1)
    {
        return $this->afterCreating(function ($mahasiswa) use ($count) {
            if ($mahasiswa->status === 'aktif') {
                $user = User::factory($count)->create([
                    'email' => $mahasiswa->email,
                    'role' => 'mahasiswa',
                    'mahasiswa_id' => $mahasiswa->id,
                ]);
                $mahasiswa->user()->saveMany($user);
            }
        });
    }
}
