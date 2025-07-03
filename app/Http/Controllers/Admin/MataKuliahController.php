<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Dosen;

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
    public function index()
    {
        $mataKuliahs = MataKuliah::orderByDesc('created_at')->get();
        $mataKuliahs->each(function ($mataKuliah) {
            $mataKuliah->dosen;
        });
        return Inertia::render('admin/mata-kuliah/index', [
            'mataKuliahs' => $mataKuliahs,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();
        return Inertia::render('admin/mata-kuliah/create', [
            'dosens' => $dosens,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
            return redirect()->route('admin.mata-kuliah.show', $mataKuliah->id)->with('success', "Data mata kuliah {$mataKuliah->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data mata kuliah.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        return Inertia::render('admin/mata-kuliah/show', [
            'mataKuliah' => $mataKuliah,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();
        return Inertia::render('admin/mata-kuliah/edit', [
            'mataKuliah' => $mataKuliah,
            'dosens' => $dosens,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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
            session()->flash('success', "Data ruang kelas {$mataKuliah->nama} berhasil diperbarui.");
            return redirect()->route('admin.mata-kuliah.edit')->with('success', 'Data ruang kelas berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data ruang kelas.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $mataKuliah = MataKuliah::findOrFail($id);
            $mataKuliah->delete();
            session()->flash('success', "Data ruang kelas {$mataKuliah->nama} berhasil dihapus.");
            return redirect()->route('admin.mata-kuliah.index')->with('success', 'Data ruang kelas berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data ruang kelas.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $mataKuliah = MataKuliah::with('dosen')->findOrFail($id);
        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $mataKuliah->update([
            'status' => $request->status
        ]);
        return redirect()->route('admin.mata-kuliah.index')->with('success', "Status mata kuliah {$mataKuliah->nama} berhasil diperbarui.");
    }
}
