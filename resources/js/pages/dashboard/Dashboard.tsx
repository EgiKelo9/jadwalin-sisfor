import Sidebar from "./Sidebar";
import Calendar from "./calendar";
import Schedule from "./Schedule";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex flex-1 flex-col p-6 gap-4">
        <h1 className="text-2xl font-semibold">Beranda</h1>
        <div className="flex flex-1 gap-4">
          <div className="flex-1">
            <Schedule />
          </div>
          <Calendar />
        </div>
      </main>
    </div>
  );
}
