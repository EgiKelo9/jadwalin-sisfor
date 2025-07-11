<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\JadwalSementara;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateParam = $request->query('date'); // Contoh: 2025-07-13
        $carbonDate = $dateParam ? Carbon::parse($dateParam) : Carbon::today();
        $formattedDate = $carbonDate->format('Y-m-d');

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
                // dd($formattedDate);
                $jadwal = JadwalSementara::with(['jadwal.mataKuliah', 'jadwal.ruangKelas'])->where('tanggal', $formattedDate)->get();
                // dd($jadwal->toArray());
                return Inertia::render('beranda', [
                    'jadwal' => $jadwal->toArray(),
                    'user' => $admin,
                    'userRole' => 'admin',
                ]);
            }
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda.');
        }
    }
}
