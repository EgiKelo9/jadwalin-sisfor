export default function Sidebar() {
  const menu = [
    { label: "Beranda", icon: "🏠" },
    { label: "Jadwal Perkuliahan", icon: "📅" },
    { label: "Peminjaman Kelas", icon: "📋" },
    { label: "Mata Kuliah", icon: "📖" },
    { label: "Ruang Kelas", icon: "🏫" },
    { label: "Data Dosen", icon: "👨‍🏫" },
    { label: "Data Mahasiswa", icon: "👨‍🎓" },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 font-bold text-lg">JadwalIn</div>
      <nav className="flex-1">
        {menu.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t flex items-center gap-2">
        <span className="rounded-full bg-gray-200 p-2">👤</span>
        <div className="text-sm">Ketut Budi Susilo</div>
      </div>
    </aside>
  );
}
