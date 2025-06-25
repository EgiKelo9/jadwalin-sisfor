<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
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
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telepon' => fake()->phoneNumber(),
            'alamat' => fake()->address(),
            'status' => 'aktif',
        ];
    }

    public function withAccount($count = 1)
    {
        return $this->afterCreating(function ($admin) use ($count) {
            if ($admin->status === 'aktif') {
                $user = User::factory($count)->create([
                    'email' => $admin->email,
                    'role' => 'admin',
                    'admin_id' => $admin->id,
                ]);
                $admin->user()->saveMany($user);
            }
        });
    }
}
