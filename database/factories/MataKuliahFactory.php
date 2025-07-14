<?php
namespace Database\Factories;
use App\Models\Dosen;
use App\Models\Jadwal;
use Illuminate\Database\Eloquent\Factories\Factory;

class MataKuliahFactory extends Factory
{
    public function definition(): array
    {
        return [
            'kode' => $this->faker->unique()->bothify('MK-######'),
            'nama' => ucwords(implode(' ', $this->faker->words(2))),
            'bobot_sks' => $this->faker->numberBetween(1, 4),
            'kapasitas' => $this->faker->numberBetween(20, 60),
            'semester' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'jenis' => $this->faker->randomElement(['wajib', 'pilihan']),
            'dosen_id' => Dosen::inRandomOrder()->first()->id ?? null,
        ];
    }

    public function withClasses($classCount = 6, $isObscure = false)
    {
        // For obscure subjects, limit to class A only
        if ($isObscure) {
            $classCount = 1;
        }
        
        // Limit class count to maximum of 6 (A-F)
        $classCount = min($classCount, 6);
        
        $baseKode = $this->faker->unique()->bothify('MK-######');
        $baseName = ucwords(implode(' ', $this->faker->words(2)));
        $baseProperties = [
            'bobot_sks' => $this->faker->numberBetween(1, 4),
            'kapasitas' => $this->faker->numberBetween(20, 60),
            'semester' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'jenis' => $this->faker->randomElement(['wajib', 'pilihan']),
        ];
        
        $createdClasses = collect();
        $classes = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        for ($i = 0; $i < $classCount; $i++) {
            $classLetter = $classes[$i];
            
            // Generate incremental kode (increment by 1 from base)
            $currentKode = $i === 0 ? $baseKode : $this->incrementKode($baseKode, $i);
            
            $mataKuliah = \App\Models\MataKuliah::create(array_merge($baseProperties, [
                'kode' => $currentKode,
                'nama' => $baseName . ' - ' . $classLetter,
                'dosen_id' => Dosen::inRandomOrder()->first()->id ?? null, // May differ between classes
            ]));
            
            $createdClasses->push($mataKuliah);
        }
        
        return $createdClasses;
    }

    public function obscure()
    {
        $obscureSubjects = [
            'Pendidikan Agama',
            'Pendidikan Pancasila',
            'Pendidikan Kewarganegaraan',
            'Bahasa Indonesia',
            'Etika Profesi',
            'Kewirausahaan',
            'Pendidikan Anti Korupsi',
            'Wawasan Kebangsaan'
        ];
        
        return $this->state(function (array $attributes) use ($obscureSubjects) {
            return [
                'nama' => $this->faker->randomElement($obscureSubjects) . ' - A',
                'bobot_sks' => 2,
                'jenis' => 'wajib',
                'kapasitas' => $this->faker->numberBetween(40, 80),
            ];
        });
    }

    public function singleClass()
    {
        return $this->state(function (array $attributes) {
            return [
                'nama' => $attributes['nama'] . ' - A',
            ];
        });
    }

    private function incrementKode($baseKode, $increment)
    {
        if (preg_match('/^([A-Z-]+)(\d+)$/', $baseKode, $matches)) {
            $prefix = $matches[1];
            $number = intval($matches[2]);
            $newNumber = $number + $increment;
            
            $paddedNumber = str_pad($newNumber, strlen($matches[2]), '0', STR_PAD_LEFT);
            
            return $prefix . $paddedNumber;
        }
        
        return $baseKode . '-' . $increment;
    }

    public function withSchedule($count = 1)
    {
        return $this->afterCreating(function ($mataKuliah) use ($count) {
            if ($mataKuliah->status === 'aktif') {
                $jadwal = Jadwal::factory($count)->create(['mata_kuliah_id' => $mataKuliah->id]);
                $mataKuliah->jadwal()->saveMany($jadwal);
            }
        });
    }
}
