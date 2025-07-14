<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Dosen;
use App\Models\MataKuliah;
use Illuminate\Http\Request;

class MataKuliahController extends Controller
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
        if (!$user->hasAccess('Lihat Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data mata kuliah.']);
        }
        if ($request->has('tabAktif') && $request->get('tabAktif') === 'Favorit') {
            session(['tabAktif' => "Favorit"]);
            $mataKuliahs = MataKuliah::with('dosen')
                ->whereHas('mahasiswas', function ($query) use ($user) {
                    $query->where('mahasiswa_id', $user->mahasiswa_id);
                })
                ->orderByDesc('created_at')
                ->get();
            return Inertia::render('mata-kuliah/index', [
                'mataKuliahs' => $mataKuliahs,
                'userRole' => $user->role,
                'user' => $this->getReturnedUser(),
                'canCreate' => $user->hasAccess('Buat Mata Kuliah'),
                'canUpdate' => $user->hasAccess('Ubah Mata Kuliah'),
                'canDelete' => $user->hasAccess('Hapus Mata Kuliah'),
                'tabAktif' => 'Favorit',
                'isMahasiswa' => true,
            ]);
        }
        return Inertia::render('mata-kuliah/index', [
            'mataKuliahs' => MataKuliah::with('dosen')->orderByDesc('created_at')->get(),
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Mata Kuliah'),
            'canUpdate' => $user->hasAccess('Ubah Mata Kuliah'),
            'canDelete' => $user->hasAccess('Hapus Mata Kuliah'),
            'tabAktif' => 'Semua',
            'isMahasiswa' => $user->role === 'mahasiswa' ? true : false,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data mata kuliah.']);
        }
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();
        return Inertia::render('mata-kuliah/create', [
            'dosens' => $dosens,
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
        if (!$user->hasAccess('Buat Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data mata kuliah.']);
        }
        $request->validate([
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:255',
            'bobot_sks' => 'required|integer|min:1|max:6',
            'kapasitas' => 'required|integer|min:1',
            'semester' => 'required|integer|min:1|max:8',
            'status' => 'required|in:aktif,nonaktif',
            'jenis' => 'required|in:wajib,pilihan',
            'dosen_id' => 'nullable|exists:dosens,id',
        ], [
            'kode.required' => 'Kode mata kuliah harus diisi.',
            'kode.max' => 'Kode mata kuliah maksimal 20 karakter.',
            'nama.required' => 'Nama mata kuliah harus diisi.',
            'nama.max' => 'Nama mata kuliah maksimal 255 karakter.',
            'bobot_sks.required' => 'Bobot SKS harus diisi.',
            'bobot_sks.integer' => 'Bobot SKS harus berupa angka.',
            'bobot_sks.min' => 'Bobot SKS minimal 1.',
            'bobot_sks.max' => 'Bobot SKS maksimal 6.',
            'kapasitas.required' => 'Kapasitas harus diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas minimal 1.',
            'semester.required' => 'Semester harus diisi.',
            'semester.integer' => 'Semester harus berupa angka.',
            'semester.min' => 'Semester minimal 1.',
            'semester.max' => 'Semester maksimal 8.',
            'status.required' => 'Status harus dipilih.',
            'jenis.required' => 'Jenis mata kuliah harus dipilih.',
        ]);

        try {
            $mataKuliah = MataKuliah::create([
                'kode' => $request->kode,
                'nama' => $request->nama,
                'bobot_sks' => $request->bobot_sks,
                'kapasitas' => $request->kapasitas,
                'semester' => $request->semester,
                'status' => $request->status,
                'jenis' => $request->jenis,
                'dosen_id' => $request->dosen_id,
            ]);
            session()->flash('success', "Data mata kuliah {$mataKuliah->nama} berhasil ditambahkan.");
            return redirect()->route("{$user->role}.mata-kuliah.show", $mataKuliah->id)->with('success', "Data mata kuliah {$mataKuliah->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data mata kuliah.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data mata kuliah.']);
        }
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        return Inertia::render('mata-kuliah/show', [
            'mataKuliah' => $mataKuliah,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Mata Kuliah'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mata kuliah.']);
        }
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();
        return Inertia::render('mata-kuliah/edit', [
            'mataKuliah' => $mataKuliah,
            'dosens' => $dosens,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Mata Kuliah'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mata kuliah.']);
        }
        $request->validate([
            'kode' => 'required|string|max:20',
            'nama' => 'required|string|max:255',
            'bobot_sks' => 'required|integer|min:1|max:6',
            'kapasitas' => 'required|integer|min:1',
            'semester' => 'required|integer|min:1|max:8',
            'status' => 'required|in:aktif,nonaktif',
            'jenis' => 'required|in:wajib,pilihan',
            'dosen_id' => 'nullable|exists:dosens,id',
        ], [
            'kode.required' => 'Kode mata kuliah harus diisi.',
            'kode.max' => 'Kode mata kuliah maksimal 20 karakter.',
            'nama.required' => 'Nama mata kuliah harus diisi.',
            'nama.max' => 'Nama mata kuliah maksimal 255 karakter.',
            'bobot_sks.required' => 'Bobot SKS harus diisi.',
            'bobot_sks.integer' => 'Bobot SKS harus berupa angka.',
            'bobot_sks.min' => 'Bobot SKS minimal 1.',
            'bobot_sks.max' => 'Bobot SKS maksimal 6.',
            'kapasitas.required' => 'Kapasitas harus diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas minimal 1.',
            'semester.required' => 'Semester harus diisi.',
            'semester.integer' => 'Semester harus berupa angka.',
            'semester.min' => 'Semester minimal 1.',
            'semester.max' => 'Semester maksimal 8.',
            'status.required' => 'Status harus dipilih.',
            'jenis.required' => 'Jenis mata kuliah harus dipilih.',
        ]);

        try {
            $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
            $mataKuliah->update([
                'kode' => $request->kode,
                'nama' => $request->nama,
                'bobot_sks' => $request->bobot_sks,
                'kapasitas' => $request->kapasitas,
                'semester' => $request->semester,
                'status' => $request->status,
                'jenis' => $request->jenis,
                'dosen_id' => $request->dosen_id,
            ]);
            session()->flash('success', "Data mata kuliah {$mataKuliah->nama} berhasil diperbarui.");
            return redirect()->route("{$user->role}.mata-kuliah.edit")->with('success', 'Data mata kuliah berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data mata kuliah.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus data mata kuliah.']);
        }
        try {
            $mataKuliah = MataKuliah::findOrFail($id);
            $mataKuliah->delete();
            session()->flash('success', "Data mata kuliah {$mataKuliah->nama} berhasil dihapus.");
            return redirect()->route("{$user->role}.mata-kuliah.index")->with('success', 'Data mata kuliah berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data mata kuliah.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mata kuliah.']);
        }
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $mataKuliah->update([
            'status' => $request->status
        ]);
        return redirect()->route("{$user->role}.mata-kuliah.index")->with('success', "Status mata kuliah {$mataKuliah->nama} berhasil diperbarui.");
    }

    public function updateFavorite(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Mata Kuliah')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data mata kuliah.']);
        }
        $mataKuliah = MataKuliah::findOrFail($id);
        if ($request->tabAktif === 'Favorit') {
            $mataKuliah->mahasiswas()->detach($user->mahasiswa_id);
            session()->flash('success', "Mata kuliah {$mataKuliah->nama} berhasil dihapus dari favorit.");
        } else {
            $mataKuliah->mahasiswas()->attach($user->mahasiswa_id);
            session()->flash('success', "Mata kuliah {$mataKuliah->nama} berhasil ditambahkan ke favorit.");
        }
        return redirect()->route("{$user->role}.mata-kuliah.index");
    }
}
