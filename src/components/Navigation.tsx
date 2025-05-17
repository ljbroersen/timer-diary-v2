import Calendar from "react-calendar";
import { type DateRecord } from "./Diary";
import "../calendar.css"

interface NavigationProps {
  dates: DateRecord[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  setVisibleLogIndex?: (index: number) => void;
}

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
    <div>
      <h2>Calendar</h2>
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
      />
    </div>
  );
}
