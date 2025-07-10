<?php

namespace Database\Factories;

use App\Models\Jadwal;
use App\Models\RuangKelas;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PerubahanJadwal>
 */
class PerubahanJadwalFactory extends Factory
{
    private function getRandomRole(): string
    {
        $roles = ['admin', 'dosen'];
        return $roles[array_rand($roles)];
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $role = $this->getRandomRole();
        $userId = match ($role) {
            'admin' => \App\Models\Admin::all()->random()->id,
            'dosen' => \App\Models\Dosen::all()->random()->id,
        };

        return [
            'jadwal_id' => Jadwal::all()->random()->id,
            'mahasiswa_id' => null,
            'dosen_id' => $role === 'dosen' ? $userId : null,
            'admin_id' => $role === 'admin' ? $userId : null,
            'ruang_kelas_id' => RuangKelas::all()->random()->id,
            'hari_perubahan' => fake()->randomElement(['senin', 'selasa', 'rabu', 'kamis', 'jumat']),
            'jam_mulai_baru' => fake()->time('H:i'),
            'jam_selesai_baru' => fake()->time('H:i'),
            'alasan_perubahan' => fake()->sentence(10),
            'status' => 'pending',
        ];
    }
}
