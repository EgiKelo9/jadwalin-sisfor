import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const BASE_START_MIN = 8 * 60;
const BASE_END_MIN = 19 * 60;
const PIXELS_PER_MIN = 1.5;

export default function Schedule({
  jadwal,
  selectedDate,
  selectedMonthYear,
  setSelectedDate,
  setSelectedMonthYear
}: {
  jadwal?: any[];
  selectedDate: number;
  selectedMonthYear: string;
  setSelectedDate: (date: number) => void;
  setSelectedMonthYear: (period: string) => void;
}) {
  const selectedPeriod = selectedMonthYear;

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const periods = [];
  for (const year of [2024, 2025, 2026]) {
    for (const month of months) {
      periods.push(`${month} ${year}`);
    }
  }

  const [monthName, yearStr] = selectedPeriod.split(" ");
  const year = parseInt(yearStr, 10);
  const monthIndex = months.findIndex((m) => m === monthName);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  const placedEvents: { start: number; end: number; column: number }[] = [];
  const totalHeight = (BASE_END_MIN - BASE_START_MIN) * PIXELS_PER_MIN;

  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-emerald-200",
  ];

  return (
    <div className="bg-white rounded-lg p-4 w-full border relative">
      {/* Dropdown Bulan & Tahun */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Baris tanggal */}
      <ScrollArea className="w-[850px] mb-4">
        <div className="flex w-max space-x-2 px-1 pb-2 border-b">
          {Array.from({ length: lastDay }).map((_, idx) => {
            const date = idx + 1;
            const isActive = date === selectedDate;
            const dateObj = new Date(year, monthIndex, date);
            const dayLabel = dateObj.toLocaleDateString("id-ID", {
              weekday: "short",
            });
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

            return (
              <div
                key={date}
                className={`flex flex-col items-center justify-center cursor-pointer px-3 py-2 rounded min-w-[50px] ${
                  isActive
                    ? "bg-teal-500 text-white font-medium"
                    : `hover:bg-gray-100 text-gray-700 ${isWeekend ? "text-red-500" : ""}`
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs">{dayLabel}</div>
                <div className="text-base">{date}</div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Grid waktu */}
      <div className="flex w-full overflow-auto relative">
        {/* Sidebar jam */}
        <div className="relative w-[80px] flex-shrink-0">
          {Array.from({
            length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1,
          }).map((_, i) => {
            const hour = 8 + i;
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={hour}
                className="absolute text-xs text-gray-500"
                style={{
                  top: `${top}px`,
                  height: `${60 * PIXELS_PER_MIN}px`,
                }}
              >
                <div className="flex items-start h-full border-t border-gray-200 pt-1">
                  {hour}:00
                </div>
              </div>
            );
          })}
        </div>

        {/* Konten jadwal */}
        <div
          className="relative flex-1"
          style={{ height: `${totalHeight}px`, minWidth: "400px" }}
        >
          {Array.from({
            length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1,
          }).map((_, i) => {
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={i}
                className="absolute left-0 w-full border-t border-dashed border-gray-200"
                style={{ top: `${top}px` }}
              />
            );
          })}

          {jadwal && jadwal.length > 0 ? (
            jadwal.map((item, idx) => {
              const startMin = parseTimeToMinutes(item.jam_mulai);
              const endMin = parseTimeToMinutes(item.jam_selesai);
              const top = (startMin - BASE_START_MIN) * PIXELS_PER_MIN;
              const height = (endMin - startMin) * PIXELS_PER_MIN;

              const overlapping = placedEvents.filter(
                (prev) => startMin < prev.end && endMin > prev.start
              );

              let column = 0;
              while (overlapping.some((e) => e.column === column)) {
                column++;
              }

              placedEvents.push({ start: startMin, end: endMin, column });

              const leftOffsetPx = column * 250;
              const colorClass = colors[idx % colors.length];

              return (
                <div
                  key={idx}
                  className={`absolute rounded-lg shadow-md p-2 text-sm ${colorClass}`}
                  style={{
                    top: `${top}px`,
                    left: `${leftOffsetPx}px`,
                    height: `${height}px`,
                    width: "fit-content",
                    minWidth: "120px",
                    maxWidth: "250px",
                  }}
                >
                  <div className="font-semibold">
                    {item.jadwal?.mata_kuliah?.nama || "Tanpa Nama"}
                  </div>
                  <div className="text-xs">
                    {item.jadwal?.ruang_kelas?.nama || "-"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.jam_mulai} - {item.jam_selesai}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm absolute top-4 left-4">
              Tidak ada jadwal untuk hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
