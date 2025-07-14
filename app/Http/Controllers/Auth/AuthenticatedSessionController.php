<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'error' => $request->session()->get('error'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return redirect()->back()->with('error', __('User tidak ditemukan.'));
        }

        $status = match ($user->role) {
            'mahasiswa' => $user->mahasiswa->status,
            'dosen' => $user->dosen->status,
            'admin' => $user->admin->status,
            default => 'unknown',
        };

        if ($status !== 'aktif') {
            return redirect()->back()->with('error', 'Status Anda tidak aktif. Silakan hubungi administrator.');
        }

        $request->authenticate();

        $request->session()->regenerate();

        if ($user->mahasiswa && $user->mahasiswa->mataKuliahs->isEmpty()) {
            return to_route('mahasiswa.mata-kuliah.index')->with('info', 'Anda belum memilih mata kuliah. Silakan pilih mata kuliah terlebih dahulu.');
        }

        return redirect()->intended(route($user->role . '.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
