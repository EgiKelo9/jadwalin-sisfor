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

    /**
     * Mendapatkan semua akses yang dimiliki user
     * Kombinasi dari akses default role + akses khusus
     */
    public function getAllAccess(): array
    {
        $defaultAccess = $this->getDefaultAccessByRole();
        $customAccess = $this->getCustomAccess();
        return array_unique(array_merge($defaultAccess, $customAccess));
    }

    /**
     * Mendapatkan akses default berdasarkan role user
     */
    public function getDefaultAccessByRole(): array
    {
        $userRole = $this->getRole();
        return AksesRole::getDefaultAccessByRole($userRole);
    }

    /**
     * Mendapatkan akses khusus dari tabel akses_akuns
     */
    public function getCustomAccess(): array
    {
        $customAccess = $this->aksesRoles()
            ->wherePivot('status', true)
            ->get();
        return $customAccess->pluck('akses')->toArray();
    }

    /**
     * Mengecek apakah user memiliki akses tertentu
     */
    public function hasAccess(string $access): bool
    {
        return in_array($access, $this->getAllAccess());
    }

    /**
     * Mengecek apakah user memiliki salah satu dari beberapa akses
     */
    public function hasAnyAccess(array $accesses): bool
    {
        $userAccesses = $this->getAllAccess();
        return !empty(array_intersect($accesses, $userAccesses));
    }

    /**
     * Mengecek apakah user memiliki semua akses yang diminta
     */
    public function hasAllAccess(array $accesses): bool
    {
        $userAccesses = $this->getAllAccess();
        return empty(array_diff($accesses, $userAccesses));
    }

    /**
     * Menambahkan semua akses default berdasarkan role user
     */
    public function grantDefaultAccessByRole(string $role): void
    {
        $targetRole = $role ?? $this->getRole();
        $defaultAccesses = AksesRole::getDefaultAccessByRole($targetRole);
        $allAccesses = AksesRole::getAllAccess();

        foreach ($allAccesses as $access) {
            $aksesRole = AksesRole::where('akses', $access)->first();
            if (!$aksesRole) continue;

            $status = in_array($access, $defaultAccesses);

            $existingAccess = $this->aksesRoles()->where('akses_role_id', $aksesRole->id)->first();

            if ($existingAccess) {
                $this->aksesRoles()->updateExistingPivot($aksesRole->id, ['status' => $status]);
            } else {
                $this->aksesRoles()->attach($aksesRole->id, ['status' => $status]);
            }
        }
    }

    /**
     * Menambahkan akses khusus untuk user
     */
    public function grantCustomAccess(string $role, string $access): void
    {
        $aksesRole = AksesRole::where('akses', $access)->first();
        if (!$aksesRole) return;

        $defaultAccesses = AksesRole::getDefaultAccessByRole($role);
        $status = in_array($access, $defaultAccesses);

        $existingAccess = $this->aksesRoles()->where('akses_role_id', $aksesRole->id)->first();

        if ($existingAccess) {
            $this->aksesRoles()->updateExistingPivot($aksesRole->id, ['status' => $status]);
        } else {
            $this->aksesRoles()->attach($aksesRole->id, ['status' => $status]);
        }
    }

    /**
     * Mencabut akses khusus dari user
     */
    public function revokeCustomAccess(string $access): bool
    {
        $aksesRole = AksesRole::where('akses', $access)->first();

        if ($aksesRole) {
            $this->aksesRoles()->detach($aksesRole->id);
            return true;
        }

        return false;
    }

    /**
     * Menonaktifkan akses khusus tanpa menghapus
     */
    public function disableCustomAccess(string $access): bool
    {
        $aksesRole = AksesRole::where('akses', $access)->first();

        if ($aksesRole) {
            $this->aksesRoles()->updateExistingPivot($aksesRole->id, ['status' => false]);
            return true;
        }

        return false;
    }

    /**
     * Mengaktifkan kembali akses khusus
     */
    public function enableCustomAccess(string $access): bool
    {
        $aksesRole = AksesRole::where('akses', $access)->first();

        if ($aksesRole) {
            $this->aksesRoles()->updateExistingPivot($aksesRole->id, ['status' => true]);
            return true;
        }

        return false;
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
        return $this->belongsToMany(AksesRole::class, 'akses_akuns', 'user_id', 'akses_role_id')
            ->withPivot('status')
            ->withTimestamps();
    }
}
