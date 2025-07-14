import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const BASE_START_MIN = 8 * 60;
const BASE_END_MIN = 18 * 60;
const PIXELS_PER_MIN = 1.25;

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
    "bg-primary/30",
    "bg-secondary/30",
    "bg-accent/30",
    "bg-muted/30",
    "bg-card/30",
    "bg-destructive/30",
    "bg-ring/30",
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 w-full border border-border relative">
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="border border-input rounded px-2 py-1 text-sm bg-background text-foreground"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Baris tanggal */}
      <ScrollArea className="w-full mb-4">
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
                className={`flex flex-col items-center justify-center cursor-pointer px-3 py-2 rounded min-w-[50px] transition-colors
                  ${isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : `hover:bg-muted hover:text-muted-foreground text-gray-700 ${isWeekend ? "text-red-500" : ""}`
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
      <div className="flex w-full overflow-auto relative">
        <div className="relative w-[80px] flex-shrink-0">
          {Array.from({
            length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1,
          }).map((_, i) => {
            const hour = 8 + i;
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={hour}
                className="absolute text-xs text-muted-foreground"
                style={{
                  top: `${top}px`,
                  height: `${60 * PIXELS_PER_MIN}px`,
                }}
              >
                <div className="flex items-start h-full border-t border-border pt-1">
                  {hour}:00
                </div>
              </div>
            );
          })}
        </div>
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
                className="absolute left-0 w-full border-t border-dashed border-border"
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
                  className={`absolute rounded-lg shadow-md p-2 text-sm ${colorClass} border border-border`}
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
                    {item.lokasi === "offline" ? item.ruang_kelas?.nama : "Online Meeting"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.jam_mulai.slice(0, 5)} - {item.jam_selesai.slice(0, 5)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-muted-foreground text-sm absolute top-4 left-4">
              Tidak ada jadwal untuk hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
