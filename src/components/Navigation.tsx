import Calendar from "react-calendar";
import type { NavigationProps } from "../types/types";
import "../calendar.css";

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default function Navigation({
  dates,
  selectedDate,
  setSelectedDate,
  setVisibleLogIndex,
}: NavigationProps) {
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border shadow-md p-4 max-h-[calc(100%-2rem)]">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <Calendar
        onChange={(date) => {
          setSelectedDate(date as Date);
          if (setVisibleLogIndex) setVisibleLogIndex(0);
        }}
        value={selectedDate}
        tileClassName={({ date }) => {
          const formattedDate = formatDate(date);
          return dates.some((d) => d.date === formattedDate) ? "highlight" : "";
        }}
        className="w-full"
      />
    </div>
  );
}