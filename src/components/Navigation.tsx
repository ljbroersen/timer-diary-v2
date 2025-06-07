import { useQuery } from "@tanstack/react-query";
import Calendar from "react-calendar";
import type { DateRecord } from "../types/types";
import "../calendar.css";
import { useEffect } from "react";

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default function Navigation({
  URL,
  selectedDate,
  setSelectedDate,
  setVisibleLogIndex,
  setDiaryDates,
}: {
  URL: string;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  setVisibleLogIndex?: (index: number) => void;
  setDiaryDates: (dates: DateRecord[]) => void;
}) {
  const {
    data: dates = [],
    error,
    isSuccess: datesSuccess,
  } = useQuery<DateRecord[]>({
    queryKey: ["dates"],
    queryFn: async () => {
      const res = await fetch(`${URL}/dates`);
      if (!res.ok) throw new Error("Failed to fetch dates");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    if (datesSuccess) {
      const sorted = dates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDiaryDates(sorted);
    }
  }, [datesSuccess, dates, setDiaryDates]);

  if (error) {
    return <p className="text-red-500">Failed to load dates.</p>;
  }
  return (
    <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border shadow-md p-4 max-h-[calc(100%-2rem)]">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>

      {error && <p className="text-sm text-red-500 mb-2">Failed to load dates.</p>}

      <Calendar
        onChange={(date) => {
          setSelectedDate(date as Date);
          if (setVisibleLogIndex) setVisibleLogIndex(0);
        }}
        value={selectedDate}
        tileClassName={({ date }) => {
          const formattedDate = formatDate(date);
          const isHighlighted = dates.some((d) => d.date === formattedDate);
          const isSelected =
            selectedDate && formatDate(selectedDate) === formattedDate;

          return isSelected
            ? "react-calendar__tile--active"
            : isHighlighted
            ? "highlight"
            : "";
        }}
        className="w-full"
      />
    </div>
  );
}