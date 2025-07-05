<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PeminjamanKelas>
 */
class PeminjamanKelasFactory extends Factory
{
    private function getRandomRole(): string
    {
        $roles = ['mahasiswa', 'dosen'];
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
            'mahasiswa' => \App\Models\Mahasiswa::all()->random()->id,
            'dosen' => \App\Models\Dosen::all()->random()->id,
        };

        // Generate random date between July 1-31, 2025
        $tanggalPeminjaman = fake()->dateTimeBetween('2025-07-01', '2025-07-31')->format('Y-m-d');

        // Generate start time between 08:00 and 16:00 with only 00 and 30 minutes
        $startHour = fake()->numberBetween(8, 16);
        $startMinute = fake()->randomElement([0, 30]);
        $jamMulai = sprintf('%02d:%02d', $startHour, $startMinute);

        // Generate end time 4-6 hours after start time with only 00 and 30 minutes
        $durationHours = fake()->numberBetween(4, 6);
        $endDateTime = \DateTime::createFromFormat('H:i', $jamMulai);
        $endDateTime->add(new \DateInterval('PT' . $durationHours . 'H'));
        
        // Ensure end minute is either 00 or 30
        $endMinute = fake()->randomElement([0, 30]);
        $endDateTime->setTime($endDateTime->format('H'), $endMinute);
        $jamSelesai = $endDateTime->format('H:i');

        return [
            'mahasiswa_id' => $role === 'mahasiswa' ? $userId : null,
            'dosen_id' => $role === 'dosen' ? $userId : null,
            'admin_id' => null,
            'ruang_kelas_id' => \App\Models\RuangKelas::all()->random()->id,
            'tanggal_peminjaman' => $tanggalPeminjaman,
            'jam_mulai' => $jamMulai,
            'jam_selesai' => $jamSelesai,
            'alasan' => fake()->sentence(),
            'status' => fake()->randomElement(['pending', 'diterima', 'ditolak']),
        ];
    }
}
