<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dosen>
 */
class DosenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nip' => fake()->unique()->numerify('####################'),
            'nidn' => fake()->unique()->numerify('##########'),
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telepon' => fake()->phoneNumber(),
            'alamat' => fake()->address(),
            'status' => 'aktif',
        ];
    }

    public function withAccount($count = 1)
    {
        return $this->afterCreating(function ($dosen) use ($count) {
            if ($dosen->status === 'aktif') {
                $user = User::factory($count)->create([
                    'email' => $dosen->email,
                    'role' => 'dosen',
                    'dosen_id' => $dosen->id,
                ]);
                $dosen->user()->saveMany($user);
            }
        });
    }
}
