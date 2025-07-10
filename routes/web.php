<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\RuangKelasController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\PeminjamanKelasController;
use App\Http\Controllers\AksesRoleController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard routes
    Route::controller(DashboardController::class)->group(function () {
        foreach (['admin', 'dosen', 'mahasiswa'] as $role) {
            Route::get("{$role}/beranda", "index")->name("{$role}.dashboard");
        }
    });

    // Resource routes
    foreach (['admin', 'dosen', 'mahasiswa'] as $role) {
        Route::prefix($role)->name("{$role}.")->group(function () use ($role) {
            Route::resource('data-mahasiswa', MahasiswaController::class);
            Route::put('data-mahasiswa/{data_mahasiswa}/status', [MahasiswaController::class, 'updateStatus'])
                ->name('data-mahasiswa.updateStatus');
            Route::resource('data-dosen', DosenController::class);
            Route::put('data-dosen/{data_dosen}/status', [DosenController::class, 'updateStatus'])
                ->name('data-dosen.updateStatus');
            Route::resource('ruang-kelas', RuangKelasController::class);
            Route::resource('mata-kuliah', MataKuliahController::class);
            Route::put('mata-kuliah/{mata_kuliah}/status', [MataKuliahController::class, 'updateStatus'])
                ->name('mata-kuliah.updateStatus');
            Route::prefix('peminjaman-kelas')->name('peminjaman-kelas.')->group(function () {
                Route::get('riwayat', [PeminjamanKelasController::class, 'history'])
                    ->name('history');
                Route::get('riwayat/{peminjaman_kelas}', [PeminjamanKelasController::class, 'historyShow'])
                    ->name('history.show');
                Route::get('riwayat/{peminjaman_kelas}/ubah', [PeminjamanKelasController::class, 'historyEdit'])
                    ->name('history.edit');
                Route::put('riwayat/{peminjaman_kelas}', [PeminjamanKelasController::class, 'historyUpdate'])
                    ->name('history.update');
                Route::delete('riwayat/{peminjaman_kelas}', [PeminjamanKelasController::class, 'historyDestroy'])
                    ->name('history.destroy');
                Route::put('{peminjaman_kelas}/status', [PeminjamanKelasController::class, 'updateStatus'])
                    ->name('updateStatus');
            });
            Route::resource('peminjaman-kelas', PeminjamanKelasController::class)
                ->except(['destroy']);
            Route::resource('peran-dan-akses', AksesRoleController::class)
                ->except(['create', 'store', 'destroy']);
        });
    }
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
