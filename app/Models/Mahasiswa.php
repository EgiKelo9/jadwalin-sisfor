<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mahasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\MahasiswaFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'mahasiswa_id');
    }

    public function mataKuliahs(): BelongsToMany
    {
        return $this->belongsToMany(MataKuliah::class, 'mahasiswa_mata_kuliah', 'mahasiswa_id', 'mata_kuliah_id')->withTimestamps();
    }

    public function peminjamanKelas(): HasMany
    {
        return $this->hasMany(PeminjamanKelas::class, 'mahasiswa_id');
    }

    public function perubahanJadwals(): HasMany
    {
        return $this->hasMany(PerubahanJadwal::class, 'mahasiswa_id');
    }

    public function perubahanJadwalSementaras(): HasMany
    {
        return $this->hasMany(PerubahanJadwalSementara::class, 'mahasiswa_id');
    }
}
