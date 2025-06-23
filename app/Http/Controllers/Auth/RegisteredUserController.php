<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Dosen;
use Inertia\Response;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required||string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'email.unique' => 'Email yang Anda gunakan sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi harus memiliki minimal :min karakter.',
        ]);

        $mahasiswa = Mahasiswa::where('email', $request->email)->first();
        $dosen = Dosen::where('email', $request->email)->first();
        $admin = Admin::where('email', $request->email)->first();

        if ($mahasiswa) {
            $role = 'mahasiswa';
        } elseif ($dosen) {
            $role = 'dosen';
        } elseif ($admin) {
            $role = 'admin';
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard.' . $role, absolute: false));
    }
}
