<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth('web')->user();
        if ($user->mahasiswa_id || $user->dosen_id || $user->admin_id) {
            if ($user->mahasiswa_id || $user->role === 'mahasiswa') {
                $mahasiswa = $user->mahasiswa_id ? $user->mahasiswa : null;
                return Inertia::render('beranda', [
                    'user' => $mahasiswa,
                    'userRole' => 'mahasiswa',
                ]);
            } elseif ($user->dosen_id || $user->role === 'dosen') {
                $dosen = $user->dosen_id ? $user->dosen : null;
                return Inertia::render('beranda', [
                    'user' => $dosen,
                    'userRole' => 'dosen',
                ]);
            } elseif ($user->admin_id || $user->role === 'admin') {
                $admin = $user->admin_id ? $user->admin : null;
                return Inertia::render('beranda', [
                    'user' => $admin,
                    'userRole' => 'admin',
                ]);
            }
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda.');
        }
    }
}
