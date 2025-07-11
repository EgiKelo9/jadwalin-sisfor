<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use App\Models\JadwalSementara;
use Illuminate\Support\Facades\DB;

class JadwalController extends Controller
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
    public function index()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwals = JadwalSementara::with(['jadwal.mataKuliah', 'ruangKelas'])
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->get();
        return Inertia::render('jadwal/index', [
            'jadwals' => $jadwals,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Jadwal Perkuliahan'),
            'canUpdate' => $user->hasAccess('Ubah Jadwal Perkuliahan'),
            'canDelete' => $user->hasAccess('Hapus Jadwal Perkuliahan'),
            'canShowAjukan' => $user->hasAccess('Lihat Perubahan Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk generate jadwal perkuliahan.']);
        }
        return Inertia::render('jadwal/create', [
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk generate jadwal perkuliahan.']);
        }

        $request->validate([
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'semester' => 'required|in:ganjil,genap',
            'jumlah_pertemuan' => 'required|integer|min:1|max:20',
        ], [
            'tanggal_mulai.required' => 'Tanggal mulai semester wajib diisi.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'tanggal_mulai.after_or_equal' => 'Tanggal mulai harus sama dengan atau setelah hari ini.',
            'semester.required' => 'Semester wajib dipilih.',
            'semester.in' => 'Semester harus ganjil atau genap.',
            'jumlah_pertemuan.required' => 'Jumlah pertemuan wajib diisi.',
            'jumlah_pertemuan.integer' => 'Jumlah pertemuan harus berupa angka.',
            'jumlah_pertemuan.min' => 'Jumlah pertemuan minimal 1.',
            'jumlah_pertemuan.max' => 'Jumlah pertemuan maksimal 20.',
        ]);

        try {
            DB::beginTransaction();

            // Clear existing temporary schedules
            JadwalSementara::truncate();

            // Generate new schedules
            Jadwal::withWeeklySchedule($request->jumlah_pertemuan, $request->tanggal_mulai, $request->semester);

            DB::commit();

            return redirect()->route("{$user->role}.jadwal-perkuliahan.index")
                ->with('success', "Jadwal perkuliahan berhasil dibuat untuk {$request->jumlah_pertemuan} pertemuan semester {$request->semester}.");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', "Gagal generate jadwal: " . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
