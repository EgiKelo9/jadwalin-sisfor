<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Dosen;
use App\Models\Jadwal;
use App\Models\MataKuliah;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DaftarJadwalController extends Controller
{
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

    public function index()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        if ($user->mahasiswa && $user->mahasiswa->mataKuliahs) {
            $jadwals = Jadwal::with(['mataKuliah', 'ruangKelas'])
                ->whereHas('mataKuliah', function ($query) use ($user) {
                    $query->whereIn('id', $user->mahasiswa->mataKuliahs->pluck('id')->toArray());
                })
                ->orderBy('status')
                ->orderByDesc('hari')
                ->orderBy('jam_mulai')
                ->get();
        } else if ($user->dosen) {
            $jadwals = Jadwal::with(['mataKuliah', 'ruangKelas'])
                ->whereHas('mataKuliah', function ($query) use ($user) {
                    $query->where('dosen_id', $user->dosen_id);
                })
                ->orderBy('status')
                ->orderByDesc('hari')
                ->orderBy('jam_mulai')
                ->get();
        } else {
            $jadwals = Jadwal::with(['mataKuliah', 'ruangKelas'])
                ->orderBy('status')
                ->orderByDesc('hari')
                ->orderBy('jam_mulai')
                ->get();
        }
        return Inertia::render('daftar-jadwal/index', [
            'daftarJadwals' => $jadwals,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Daftar Jadwal Perkuliahan'),
            'canUpdate' => $user->hasAccess('Ubah Daftar Jadwal Perkuliahan'),
            'canDelete' => $user->hasAccess('Hapus Daftar Jadwal Perkuliahan'),
            'canShowAjukan' => $user->hasAccess('Lihat Perubahan Daftar Jadwal Perkuliahan'),
        ]);
    }

    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $mataKuliahs = MataKuliah::where('status', 'aktif')
            ->with('dosen')
            ->orderBy('nama')
            ->get();
        return Inertia::render('daftar-jadwal/create', [
            'ruangKelas' => $ruangKelas,
            'mataKuliahs' => $mataKuliahs,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
        ]);
    }

    public function store(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $request->validate([
            'hari' => 'required|string|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
        ], [
            'hari.required' => 'Hari wajib diisi.',
            'jam_mulai.required' => 'Jam mulai wajib diisi.',
            'jam_selesai.required' => 'Jam selesai wajib diisi.',
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih.',
        ]);

        try {
            $jadwal = Jadwal::create([
                'hari' => $request->hari,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'mata_kuliah_id' => $request->mata_kuliah_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
            ]);
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil dibuat.');
            return redirect()->route("{$user->role}.daftar-jadwal.show", $jadwal->id)->with('success', 'Daftar jadwal perkuliahan berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwal = Jadwal::with(['mataKuliah', 'ruangKelas'])->findOrFail($id);
        $mataKuliah = $jadwal->mataKuliah->with('dosen')->first();
        return Inertia::render('daftar-jadwal/show', [
            'daftarJadwal' => $jadwal,
            'mataKuliah' => $mataKuliah,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Daftar Jadwal Perkuliahan'),
        ]);
    }

    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwal = Jadwal::with(['mataKuliah', 'ruangKelas'])->findOrFail($id);
        $mataKuliah = $jadwal->mataKuliah->with('dosen')->first();
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        return Inertia::render('daftar-jadwal/edit', [
            'daftarJadwal' => $jadwal,
            'mataKuliah' => $mataKuliah,
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Daftar Jadwal Perkuliahan'),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $request->validate([
            'hari' => 'required|string|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
        ], [
            'hari.required' => 'Hari wajib diisi.',
            'jam_mulai.required' => 'Jam mulai wajib diisi.',
            'jam_selesai.required' => 'Jam selesai wajib diisi.',
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih.',
        ]);

        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->update([
                'hari' => $request->hari,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'mata_kuliah_id' => $request->mata_kuliah_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
            ]);
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.daftar-jadwal.edit", $jadwal->id)->with('success', 'Daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            session()->flash('error', 'Gagal memperbarui daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus daftar jadwal perkuliahan.']);
        }
        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->delete();
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil dihapus.');
            return redirect()->route("{$user->role}.daftar-jadwal.index")->with('success', 'Daftar jadwal perkuliahan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus daftar jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah status daftar jadwal perkuliahan.']);
        }

        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);

        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->update(['status' => $request->status]);
            session()->flash('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.daftar-jadwal.index")->with('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status daftar jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }

    public function generateSchedule(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk generate jadwal perkuliahan.']);
        }

        try {
            $semesterType = $request->input('semester_type', 'all');
            $mata_kuliah_query = MataKuliah::where('status', 'aktif');
            
            if ($semesterType === 'ganjil') {
                $mata_kuliah_query->whereRaw('semester % 2 = 1');
            } elseif ($semesterType === 'genap') {
                $mata_kuliah_query->whereRaw('semester % 2 = 0');
            }
            
            $mata_kuliah = $mata_kuliah_query->get();
            $ruang_kelas = RuangKelas::where('status', 'layak')->get();
            
            $input_data = [
                'mata_kuliah' => $mata_kuliah->map(function($mk) {
                    return [
                        'id' => $mk->id,
                        'kode' => $mk->kode,
                        'nama' => $mk->nama,
                        'bobot_sks' => $mk->bobot_sks,
                        'kapasitas' => $mk->kapasitas,
                        'semester' => $mk->semester,
                        'status' => $mk->status,
                        'jenis' => $mk->jenis,
                        'dosen_id' => $mk->dosen_id
                    ];
                })->toArray(),
                'ruang_kelas' => $ruang_kelas->map(function($rk) {
                    return [
                        'id' => $rk->id,
                        'nama' => $rk->nama,
                        'gedung' => $rk->gedung,
                        'lantai' => $rk->lantai,
                        'kapasitas' => $rk->kapasitas,
                        'status' => $rk->status
                    ];
                })->toArray()
            ];
            
            $json_input = json_encode($input_data);
            
            $python_script = base_path('constraint_programming_json_io.py');
            $temp_input_file = tempnam(sys_get_temp_dir(), 'jadwal_input_');
            file_put_contents($temp_input_file, $json_input);
            $python_executable = env('PYTHON_EXECUTABLE');
            
            $result = Process::timeout(720) // 12 minutes timeout
                ->run("{$python_executable} {$python_script} < {$temp_input_file}");
            
            @unlink($temp_input_file);
            
            if ($result->failed()) {
                Log::error('Python script execution failed: ' . $result->errorOutput());
                return redirect()->back()->withErrors([
                    'error' => 'Gagal menjalankan script generate jadwal. Error: ' . $result->errorOutput() . ' Mohon cek .env variable PYTHON_EXECUTABLE, harus di isi dengan directory python'
                ]);
            }
            
            // Parse Python output
            $output = json_decode($result->output(), true);
            
            if (!$output || !isset($output['success'])) {
                Log::error('Invalid Python script output: ' . $result->output());
                return redirect()->back()->withErrors(['error' => 'Response tidak valid dari script generate jadwal.']);
            }
            
            if ($output['success']) {
                Jadwal::truncate();
                $saved_schedules = $this->saveSchedulesToDatabase($output['data']);
                
                $semesterInfo = match ($semesterType) {
                    'ganjil' => ' (Semester Ganjil)',
                    'genap' => ' (Semester Genap)',
                    default => '',
                };
                session()->flash('success', "Jadwal berhasil di-generate{$semesterInfo}! Total " . count($saved_schedules) . ' jadwal telah dibuat.');
                return redirect()->route("{$user->role}.daftar-jadwal.index");
            } else {
                return redirect()->back()->withErrors(['error' => $output['message'] ?? 'Generate jadwal gagal.']);
            }
            
        } catch (\Exception $e) {
            Log::error('Schedule generation error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
    
    private function saveSchedulesToDatabase($schedules)
    {
        DB::beginTransaction();
        
        try {
            Jadwal::truncate();
            
            $saved_schedules = [];
            
            foreach ($schedules as $schedule) {
                // Convert day name from Indonesian to lowercase English
                $hari = $schedule['hari'];
                
                $jadwal = Jadwal::create([
                    'mata_kuliah_id' => $schedule['mata_kuliah_id'],
                    'ruang_kelas_id' => $schedule['ruang_kelas_id'],
                    'hari' => $hari,
                    'jam_mulai' => $schedule['jam_mulai'],
                    'jam_selesai' => $schedule['jam_selesai'],
                    'status' => 'aktif'
                ]);
                
                // Load relationships
                $jadwal->load(['mataKuliah', 'ruangKelas']);
                $saved_schedules[] = $jadwal;
            }
            
            DB::commit();
            return $saved_schedules;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    public function getSchedules()
    {
        try {
            $schedules = Jadwal::with(['mataKuliah', 'ruangKelas'])
                ->orderBy('hari')
                ->orderBy('jam_mulai')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $schedules
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function deleteSchedule($id)
    {
        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Schedule deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function clearAllSchedules()
    {
        try {
            Jadwal::truncate();
            
            return response()->json([
                'success' => true,
                'message' => 'All schedules cleared successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear schedules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
