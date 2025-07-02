<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Dosen;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class DosenController extends Controller
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
        return Inertia::render('admin/dosen/index', [
            'dosens' => Dosen::orderByDesc('created_at')->get(),
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/dosen/create', [
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'required|string|max:20|unique:dosens,nip',
            'nidn' => 'required|string|max:10|unique:dosens,nidn',
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:dosens,email',
            'telepon' => 'required|string|max:15|unique:dosens,telepon',
            'alamat' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'required|in:aktif,nonaktif',
        ], [
            'nip.required' => 'NIP harus diisi.',
            'nip.max' => 'NIP maksimal 20 karakter.',
            'nip.unique' => 'NIP sudah terdaftar.',
            'nidn.required' => 'NIDN harus diisi.',
            'nidn.max' => 'NIDN maksimal 10 karakter.',
            'nidn.unique' => 'NIDN sudah terdaftar.',
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'telepon.required' => 'Telepon harus diisi.',
            'telepon.max' => 'Telepon maksimal 15 karakter.',
            'telepon.unique' => 'Telepon sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'foto.image' => 'File foto harus berupa gambar.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                    Storage::disk('public')->delete($fotoPath);
                }

                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'dosen/' . $filename;
                
                Storage::disk('public')->putFileAs('dosen', $file, $filename);
                $fotoPath = $path;
            }
            $dosen = Dosen::create([
                'nip' => $request->nip,
                'nidn' => $request->nidn,
                'nama' => $request->nama,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'foto' => $fotoPath,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data dosen {$dosen->nama} berhasil ditambahkan.");
            return redirect()->route('admin.data-dosen.show', $dosen->id)->with('success', "Data dosen {$dosen->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data dosen.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $dosen = Dosen::findOrFail($id);
        return Inertia::render('admin/dosen/show', [
            'dosen' => $dosen,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $dosen = Dosen::findOrFail($id);
        return Inertia::render('admin/dosen/edit', [
            'dosen' => $dosen,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nip' => 'required|string|max:20|unique:dosens,nip,' . $id,
            'nidn' => 'required|string|max:10|unique:dosens,nidn,' . $id,
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:dosens,email,' . $id,
            'telepon' => 'required|string|max:15|unique:dosens,telepon,' . $id,
            'alamat' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'required|in:aktif,nonaktif',
        ], [
            'nip.required' => 'NIP harus diisi.',
            'nip.max' => 'NIP maksimal 20 karakter.',
            'nip.unique' => 'NIP sudah terdaftar.',
            'nidn.required' => 'NIDN harus diisi.',
            'nidn.max' => 'NIDN maksimal 10 karakter.',
            'nidn.unique' => 'NIDN sudah terdaftar.',
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'telepon.required' => 'Telepon harus diisi.',
            'telepon.max' => 'Telepon maksimal 15 karakter.',
            'telepon.unique' => 'Telepon sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'foto.image' => 'File foto harus berupa gambar.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $dosen = Dosen::findOrFail($id);
            $fotoPath = $dosen->foto;
            if ($request->hasFile('foto')) {
                if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                    Storage::disk('public')->delete($fotoPath);
                }

                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'dosen/' . $filename;
                
                Storage::disk('public')->putFileAs('dosen', $file, $filename);
                $fotoPath = $path;
            }
            $dosen->update([
                'nip' => $request->nip,
                'nidn' => $request->nidn,
                'nama' => $request->nama,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'foto' => $fotoPath,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data dosen {$dosen->nama} berhasil diperbarui.");
            return redirect()->route('admin.data-dosen.edit')->with('success', 'Data dosen berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data dosen.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $dosen = Dosen::findOrFail($id);
            if ($dosen->foto && Storage::disk('public')->exists($dosen->foto)) {
                Storage::disk('public')->delete($dosen->foto);
            }
            $dosen->delete();
            session()->flash('success', "Data dosen {$dosen->nama} berhasil dihapus.");
            return redirect()->route('admin.data-dosen.index')->with('success', 'Data dosen berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data dosen.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $dosen = Dosen::findOrFail($id);
        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $dosen->update([
            'status' => $request->status
        ]);
        return redirect()->route('admin.data-dosen.index')->with('success', "Status dosen {$dosen->nama} berhasil diperbarui.");
    }
}
