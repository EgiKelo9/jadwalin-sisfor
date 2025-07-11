<?php

namespace Database\Factories;

use App\Models\JadwalSementara;
use App\Models\RuangKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PerubahanJadwalSementara>
 */
class PerubahanJadwalSementaraFactory extends Factory
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
            'jadwal_sementara_id' => JadwalSementara::all()->random()->id,
            'mahasiswa_id' => null,
            'dosen_id' => $role === 'dosen' ? $userId : null,
            'admin_id' => $role === 'admin' ? $userId : null,
            'ruang_kelas_id' => RuangKelas::all()->random()->id,
            'tanggal_perubahan' => fake()->date(),
            'jam_mulai_baru' => fake()->time('H:i'),
            'jam_selesai_baru' => fake()->time('H:i'),
            'alasan_perubahan' => fake()->sentence(10),
            'lokasi' => 'offline',
            'status' => 'pending',
        ];
    }
}
