import { useState } from "react";
import Timer from "./Timer";
import Diary from "./Diary";
import Navigation from "./Navigation";
import { port } from "../../server/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "./Button";
import type { LogItem, DateRecord } from "../types/types";

const URL = `http://localhost:${port}`;

export default function Main() {
  const queryClient = useQueryClient();

  const [addLog, setAddLog] = useState<((log: LogItem) => void) | null>(null);
  const [dates, setDates] = useState<DateRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateRecord | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(new Date());


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

  const handleBackToTimer = () => {
    setSelectedDate(null);
  };

  function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

return (
  <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-base))] flex items-center justify-center p-4">
    <div className="w-full max-w-[95vw] h-[850px] border rounded-xl shadow-lg overflow-hidden flex flex-col">
      
      <div className="flex items-center justify-between bg-[rgb(var(--color-bg-secondary))] px-4 py-2 border-b border-[rgb(var(--color-border-muted))] shadow-sm">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 bg-[rgb(var(--color-bg-primary))] rounded px-4 py-1 text-sm text-center text-[rgb(var(--color-text-muted))] overflow-hidden whitespace-nowrap text-ellipsis">
          http://localhost:{port}
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(250px,400px)_1fr] flex-1 overflow-hidden">
        <nav className="bg-[rgb(var(--color-bg-secondary))] p-4 overflow-y-auto">
          <Navigation
            URL={URL}
            selectedDate={selectedCalendarDate}
            setSelectedDate={(date) => {
              setSelectedCalendarDate(date);
              setSelectedDate({ id: -1, date: formatDate(date) });
            }}
            setDiaryDates={setDates}
          />
        </nav>

        <div className="flex flex-col bg-[rgb(var(--color-bg-secondary))] px-4 py-4 overflow-y-auto">
          {!selectedDate ? (
            <div className="flex justify-center text-center">
              <Timer onRestart={handleRestart} />
            </div>
          ) : (
            <>
              <Button onClick={handleBackToTimer} variant="primary" size="lg" className="w-fit mb-4">
                ← Back
              </Button>
              <Diary URL={URL} date={selectedDate} setDiaryDates={setDates} setAddLog={setAddLog} />
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}