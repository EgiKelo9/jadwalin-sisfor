<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dosen extends Model
{
    /** @use HasFactory<\Database\Factories\DosenFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'dosen_id');
    }

    public function mataKuliahs(): HasMany
    {
        return $this->hasMany(MataKuliah::class, 'dosen_id');
    }

    public function peminjamanKelas(): HasMany
    {
        return $this->hasMany(PeminjamanKelas::class, 'dosen_id');
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
