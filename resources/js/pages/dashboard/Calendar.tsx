export default function Calendar({
  selectedDate,
  selectedMonthYear,
  setSelectedDate,
}: {
  selectedDate: number;
  selectedMonthYear: string;
  setSelectedDate: (date: number) => void;
}) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [monthName, yearStr] = selectedMonthYear.split(" ");
  const year = parseInt(yearStr, 10);
  const monthIndex = months.findIndex((m) => m === monthName);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 w-72 border border-border">
      <h2 className="text-lg font-semibold mb-2">Kalender</h2>
      <div className="flex justify-center items-center mb-2 gap-2">
        <div className="text-base font-medium">
          {monthName} {year}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="font-medium">{d}</div>
        ))}
        {Array.from({ length: lastDay }, (_, i) => (
          <div
            key={i}
            onClick={() => setSelectedDate(i + 1)}
            className={`p-1 cursor-pointer rounded-full transition-colors
              ${i + 1 === selectedDate
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted hover:text-muted-foreground"
              }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
