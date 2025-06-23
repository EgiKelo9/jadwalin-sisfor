<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
