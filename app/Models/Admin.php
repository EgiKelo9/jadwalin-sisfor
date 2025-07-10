<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'admin_id');
    }

    public function peminjamanKelas(): HasMany
    {
        return $this->hasMany(PeminjamanKelas::class, 'admin_id');
    }

    public function perubahanJadwals(): HasMany
    {
        return $this->hasMany(PerubahanJadwal::class, 'mahasiswa_id');
    }
}
