<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;
    protected static ?int $mahasiswa_id;
    protected static ?int $dosen_id;
    protected static ?int $admin_id;
    protected $roles = ['mahasiswa', 'dosen', 'admin'];

    protected function getData(string $role): array
    {
        switch ($role) {
            case 'admin':
                $index = fake()->unique()->numberBetween(1, 10);
                $email = Admin::where('id', $index)->first()->email ?? fake()->unique()->safeEmail();
                return [
                    'email' => $email,
                    'id' => $index,
                ];
            case 'dosen':
                $index = fake()->unique()->numberBetween(1, 10);
                $email = Dosen::where('id', $index)->first()->email ?? fake()->unique()->safeEmail();
                return [
                    'email' => $email,
                    'id' => $index,
                ];
            case 'mahasiswa':
                $index = fake()->unique()->numberBetween(1, 10);
                $email = Mahasiswa::where('id', $index)->first()->email ?? fake()->unique()->safeEmail();
                return [
                    'email' => $email,
                    'id' => $index,
                ];
            default:
                throw new \Exception("Unknown role: $role");
        }
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'role' => fake()->randomElement($this->roles),
            'email_verified_at' => now(),
            'mahasiswa_id' => null,
            'dosen_id' => null,
            'admin_id' => null,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
