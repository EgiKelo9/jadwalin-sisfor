<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function mahasiswa()
    {
        $user = auth('web')->user();
        if ($user->mahasiswa_id || $user->getRole === 'mahasiswa') {
            $mahasiswa = $user->mahasiswa_id ? $user->mahasiswa : null;
            return Inertia::render('mahasiswa/beranda', ['user' => $mahasiswa]);
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda mahasiswa.');
        }
    }

    public function dosen()
    {
        $user = auth('web')->user();
        if ($user->dosen_id || $user->getRole === 'dosen') {
            $dosen = $user->dosen_id ? $user->dosen : null;
            return Inertia::render('dosen/beranda', ['user' => $dosen]);
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda dosen.');
        }
    }

    public function admin()
    {
        $user = auth('web')->user();
        if ($user->admin_id || $user->getRole === 'admin') {
            $admin = $user->admin_id ? $user->admin : null;
            return Inertia::render('admin/beranda', ['user' => $admin]);
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda admin.');
        }
    }
}
