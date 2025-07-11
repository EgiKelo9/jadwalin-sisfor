<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Jadwal extends Model
{
    /** @use HasFactory<\Database\Factories\JadwalFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    public function ruangKelas(): BelongsTo
    {
        return $this->belongsTo(RuangKelas::class, 'ruang_kelas_id');
    }

    public function JadwalSementaras(): HasMany
    {
        return $this->hasMany(JadwalSementara::class, 'jadwal_id');
    }

    public function perubahanJadwals(): HasMany
    {
        return $this->hasMany(PerubahanJadwal::class, 'jadwal_id');
    }

    public static function withWeeklySchedule($count = 16, $startDate = null, $semester = 'genap')
    {
        $semesterNumbers = match ($semester) {
            'ganjil' => [1, 3, 5, 7],
            'genap' => [2, 4, 6, 8],
            default => [],
        };
        $jadwals = self::where('status', 'aktif')
            ->whereHas('mataKuliah', function ($query) use ($semesterNumbers) {
                $query->whereIn('semester', $semesterNumbers);
            })
            ->get();
        $startDate = $startDate ? Carbon::parse($startDate) : Carbon::now();

        foreach ($jadwals as $jadwal) {
            // Get next occurrence of the specific day
            $dayInIndonesian = $jadwal->hari;
            $dayInEnglish = match ($dayInIndonesian) {
                'senin' => 'monday',
                'selasa' => 'tuesday',
                'rabu' => 'wednesday',
                'kamis' => 'thursday',
                'jumat' => 'friday',
            };

            // Find the first occurrence of the target day on or after the start date
            $currentDate = clone $startDate;
            while (strtolower($currentDate->englishDayOfWeek) !== $dayInEnglish) {
                $currentDate->addDay();
            }

            for ($i = 0; $i < $count; $i++) {
                if ($i > 0) {
                    $currentDate->addWeek();
                }

                JadwalSementara::create([
                    'jadwal_id' => $jadwal->id,
                    'ruang_kelas_id' => $jadwal->ruang_kelas_id,
                    'tanggal' => $currentDate->format('Y-m-d'),
                    'jam_mulai' => $jadwal->jam_mulai,
                    'jam_selesai' => $jadwal->jam_selesai,
                ]);
            }
        }

        return new self;
    }
}
