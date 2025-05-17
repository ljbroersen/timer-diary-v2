import { useState, useEffect } from "react";
import { ArrowDown } from "./ArrowDown";
import { ArrowUp } from "./ArrowUp";

interface MyLogProps {
  URL: string;
  date: DateRecord;
  setDiaryDates: (dates: DateRecord[]) => void;
  setAddLog: (addLog: (log: LogItem) => void) => void;
}

export type LogItem = {
  id: number;
  date_id: number;
  date: string;
  timer_leftover: string;
  title: string;
  description: string;
  tasks: { text: string; checked: boolean }[];
};

export type DateRecord = {
  id: number;
  date: string;
};

export default function Diary({ URL, date, setDiaryDates, setAddLog }: Readonly<MyLogProps>) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [visibleLogIndex, setVisibleLogIndex] = useState<number>(0);
  const logsPerPage = 2;

  useEffect(() => {
    // Fetch Dates on mount
    const fetchDates = async () => {
      try {
        const response = await fetch(`${URL}/dates`);
        if (response.ok) {
          const data: DateRecord[] = await response.json();
          const sorted = data.toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setDiaryDates(sorted);
        } else {
          console.error("Failed to fetch dates");
        }
      } catch (err) {
        console.error("Error fetching dates:", err);
      }
    };

    const addNewLog = (newLog: LogItem) => {
      setLogs((prev) => [...prev, newLog]);
    };

    fetchDates();
    setAddLog(() => addNewLog);
  }, [URL, setDiaryDates, setAddLog]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!date) return;

      try {
        const response = await fetch(`${URL}/logs?date=${date.date}`);
        if (response.ok) {
          const data: LogItem[] = await response.json();
          setLogs(data);
          setVisibleLogIndex(0);
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, [URL, date]);

 const renderTasksList = (logItem: LogItem) => {
  const handleTaskToggle = async (taskIndex: number) => {
    const updatedTasks = [...logItem.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      checked: !updatedTasks[taskIndex].checked,
    };

    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logItem.id ? { ...log, tasks: updatedTasks } : log
      )
    );

    try {
      const response = await fetch(`${URL}/logs/${logItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (!response.ok) {
        console.error("Failed to update tasks, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  return (
    <ul className="list-disc ml-5">
      {logItem.tasks.map((task, i) => (
        <li key={i}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={() => handleTaskToggle(i)}
            />
            <span className={task.checked ? "line-through text-gray-300" : ""}>
              {task.text}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

  const showMoreLogs = () => {
    setVisibleLogIndex((prev) => Math.min(prev + logsPerPage, logs.length - logsPerPage));
  };

  const showPreviousLogs = () => {
    setVisibleLogIndex((prev) => Math.max(prev - logsPerPage, 0));
  };

  const visibleLogs = logs.slice(visibleLogIndex, visibleLogIndex + logsPerPage);

  return (
    <div className="flex flex-col 2xl:h-[490px] sm-h-screen sm:mb-10">
      <h2 className="underline-offset-8 underline decoration-white decoration-2">
        Logs for {date.date}
      </h2>

      <div className="flex justify-center sticky top-0 z-10 p-2">
        {visibleLogIndex > 0 && <ArrowUp onClick={showPreviousLogs} />}
      </div>

      <div className="flex-grow overflow-y-auto">
        {visibleLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full">No logs for this date.</div>
        ) : (
          visibleLogs.map((logItem) => (
            <div
              key={logItem.id}
              className="p-4 [&:nth-child(even)]:bg-emerald-900 [&:nth-child(odd)]:bg-emerald-800 relative"
            >
              <h3 className="font-bold text-lg mb-1">{logItem.title}</h3>
              <p>⏱ Time Left: {logItem.timer_leftover}</p>
              <p className="whitespace-pre-wrap mt-1 mb-2">📘 {logItem.description}</p>
              {Array.isArray(logItem.tasks) && logItem.tasks.length > 0 && (
                <div>
                  <p className="font-semibold">✅ Tasks:</p>
                  {renderTasksList(logItem)}

                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center sticky bottom-0 z-10 p-2">
        {visibleLogIndex + logsPerPage < logs.length && <ArrowDown onClick={showMoreLogs} />}
      </div>
    </div>
  );
}
