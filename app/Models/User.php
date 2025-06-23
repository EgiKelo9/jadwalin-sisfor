<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Str;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getRole(): string
    {
        if ($this->mahasiswa_id) {
            return 'mahasiswa';
        } elseif ($this->dosen_id) {
            return 'dosen';
        } elseif ($this->admin_id) {
            return 'admin';
        }
        return 'unknown';
    }

    public function getName(): string
    {
        $role = $this->getRole();
        switch ($role) {
            case 'mahasiswa':
                return $this->mahasiswa->nama ?? '';
            case 'dosen':
                return $this->dosen->nama ?? '';
            case 'admin':
                return $this->admin->nama ?? '';
            default:
                return $this->name ?? '';
        }
    }

    /**
     * Get the user's initials
     */
    public function initials(): string
    {
        return Str::of($this->getName())
            ->explode(' ')
            ->take(2)
            ->map(fn($word) => Str::substr($word, 0, 1))
            ->implode('');
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function aksesRoles(): BelongsToMany
    {
        return $this->belongsToMany(AksesRole::class, 'akses_akuns', 'user_id', 'akses_role_id');
    }
}
