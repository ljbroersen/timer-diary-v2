import { useState } from "react";
import Timer from "./Timer";
import Diary, { type LogItem, type DateRecord } from "./Diary";
import Navigation from "./Navigation";
import { port } from "../../server/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL = `http://localhost:${port}`;

export default function Main() {
  const queryClient = useQueryClient();

  const [addLog, setAddLog] = useState<((log: LogItem) => void) | null>(null);
  const [dates, setDates] = useState<DateRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateRecord | null>(null);

  const createLogMutation = useMutation({
    mutationFn: async (newLog: {
      date: string;
      timer_leftover: string;
      title: string;
      description: string;
      tasks: { text: string; checked: boolean }[];
    }) => {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if (!response.ok) throw new Error("Failed to send log to server");

      return response.json();
    },
    onMutate: async (newLog) => {
      await queryClient.cancelQueries({ queryKey: ["logs"] });

      const previousLogs = queryClient.getQueryData<LogItem[]>(["logs"]);

      queryClient.setQueryData<LogItem[]>(["logs"], (old) => [
        ...(old || []),
        {
          ...newLog,
          id: Date.now(),
          date_id: -1,
        },
      ]);

      return { previousLogs };
    },
    onError: (error, _vars, context) => {
      console.error("Error creating log:", error);
      if (context?.previousLogs) {
        queryClient.setQueryData(["logs"], context.previousLogs);
      }
    },
    onSuccess: (newLog) => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });

      addLog?.(newLog);

      if (!dates.some((d) => d.date === newLog.date)) {
        setDates((prev) => [...prev, { id: newLog.date_id, date: newLog.date }]);
      }
    },
  });

  const handleRestart = (
    difference: string,
    title: string,
    description: string,
    tasks: { text: string; checked: boolean }[]
  ) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    createLogMutation.mutate({
      date: formattedDate,
      timer_leftover: difference,
      title: title.trim() || "Untitled",
      description: description.trim() || "No description provided",
      tasks,
    });
  };

  const handleDateClick = (date: DateRecord) => {
    setSelectedDate(date);
  };

  const handleBackToTimer = () => {
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen grid grid-cols-[400px_1fr] mx-12 mb-12 bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-base))]">
      <nav className="bg-[rgb(var(--color-bg-secondary))] p-4">
        <Navigation />
        <h2 className="mt-6 mb-2 font-semibold">Your Dates</h2>
        <ul className="space-y-2">
          {dates.map((date) => (
            <li key={date.id}>
              <button
                onClick={() => handleDateClick(date)}
                className="underline text-blue-500 hover:text-blue-700"
              >
                {date.date}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col min-h-screen bg-[rgb(var(--color-bg-secondary))] px-6 pt-6">
        {!selectedDate ? (
          <div className="flex justify-center text-center">
            <Timer onRestart={handleRestart} />
          </div>
        ) : (
          <>
            <button
              onClick={handleBackToTimer}
              className="self-start mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              ← Back to Timer
            </button>
            <Diary URL={URL} date={selectedDate} setDiaryDates={setDates} setAddLog={setAddLog} />
          </>
        )}
      </div>
    </div>
  );
}
