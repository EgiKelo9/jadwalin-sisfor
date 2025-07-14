<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Models\AksesRole;

class AksesRoleController extends Controller
{
    /**
     * Get the authenticated user based on their role.
     */
    private function getReturnedUser()
    {
        $user = auth('web')->user();
        return match ($user->role) {
            'mahasiswa' => $user->mahasiswa,
            'dosen' => $user->dosen,
            'admin' => $user->admin,
            default => null,
        };
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Peran dan Akses')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat peran dan akses.']);
        }

        if ($request->has('tabAktif') && $request->get('tabAktif') === 'Khusus') {
            session(['tabAktif' => "Khusus"]);
            $users = User::with(['mahasiswa', 'dosen', 'admin', 'aksesRoles'])->get();
            $aksesRole = $users->map(function ($user) {
                // dd($user->aksesRoles()->where('akses_akuns.status', true)->get());
                return (object) [
                    'id' => $user->id,
                    'nama' => $user->getName(),
                    'jumlah' => $user->aksesRoles()
                        ->where('akses_akuns.status', true)
                        ->count(),
                    'akses' => $user->aksesRoles()
                        ->where('akses_akuns.status', true)
                        ->pluck('akses')->toArray(),
                ];
            });
            return Inertia::render('peran-dan-akses/custom', [
                'aksesRole' => $aksesRole,
                'userRole' => $user->role,
                'user' => $this->getReturnedUser(),
                'canUpdate' => $user->hasAccess('Ubah Peran dan Akses'),
            ]);
        }
        session(['tabAktif' => "General"]);
        return Inertia::render('peran-dan-akses/index', [
            'aksesRole' => AksesRole::orderByDesc('created_at')->get(),
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Peran dan Akses'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Peran dan Akses')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat peran dan akses.']);
        }
        if (session()->get('tabAktif') == "Khusus") {
            $account = User::with(['mahasiswa', 'dosen', 'admin', 'aksesRoles'])->findOrFail($id);
            return Inertia::render('peran-dan-akses/show', [
                'account' => $account,
                'aksesRoles' => $account->aksesRoles,
                'user' => $this->getReturnedUser(),
            ]);
        } else {
            return Inertia::render('peran-dan-akses/show-general', [
                'user' => $this->getReturnedUser(),
                'aksesRole' => AksesRole::where('id', $id)->get(),
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Peran dan Akses')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah peran dan akses.']);
        }
        $account = User::with(['mahasiswa', 'dosen', 'admin', 'aksesRoles'])->findOrFail($id);
        return Inertia::render('peran-dan-akses/edit', [
            'account' => $account,
            'aksesRoles' => $account->aksesRoles,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Peran dan Akses')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah peran dan akses.']);
        }
        $account = User::with(['mahasiswa', 'dosen', 'admin', 'aksesRoles'])->findOrFail($id);

        $aksesAkuns =  $account->aksesRoles()->get();

        $result = $aksesAkuns->map(function ($role) {
            return [
                'id' => $role->id,
                'status' => $role->pivot->status,
            ];
        });

        $aksesIds = $request->akses ?? [];

        $syncData = $result->mapWithKeys(function ($item) use ($aksesIds) {
            return [
                $item['id'] => [
                    'status' => in_array($item['id'], $aksesIds) ? 1 : 0
                ]
            ];
        });

        $account->aksesRoles()->syncWithoutDetaching($syncData->all());
        return redirect()->back()->with('success', 'Akses berhasil diperbarui.');
    }
}
