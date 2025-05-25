import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown } from "./ArrowDown";
import { ArrowUp } from "./ArrowUp";
import Button from "./Button";
import type { LogItem, DateRecord, MyLogProps } from "../types/types";

export default function Diary({ URL, date, setDiaryDates, setAddLog }: Readonly<MyLogProps>) {
  const logsPerPage = 2;
  const [visibleLogIndex, setVisibleLogIndex] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");

  const queryClient = useQueryClient();

  const {
    data: dates = [],
    isLoading: datesLoading,
    error: datesError,
    isSuccess: datesSuccess,
  } = useQuery<DateRecord[]>({
    queryKey: ["dates"],
    queryFn: async () => {
      const res = await fetch(`${URL}/dates`);
      if (!res.ok) throw new Error("Failed to fetch dates");
      return await res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (datesSuccess) {
      const sorted = dates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDiaryDates(sorted);
    }
  }, [datesSuccess, dates]);

  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
    isSuccess: logsSuccess,
  } = useQuery<LogItem[]>({
    queryKey: ["logs", date?.date],
    queryFn: async () => {
      if (!date) return [];
      const response = await fetch(`${URL}/logs?date=${date.date}`);
      if (!response.ok) throw new Error("Failed to fetch logs");
      return await response.json();
    },
    enabled: !!date,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (logsSuccess) {
      setVisibleLogIndex(0);
    }
  }, [logsSuccess]);

  const updateLogMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<LogItem> }) => {
      const res = await fetch(`${URL}/logs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update log");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", date?.date] });
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${URL}/logs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete log");
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<LogItem[]>(["logs", date?.date], (old) =>
        (old || []).filter((log) => log.id !== deletedId)
      );
    },
  });

  useEffect(() => {
    const addNewLog = (newLog: LogItem) => {
      queryClient.setQueryData<LogItem[]>(["logs", date?.date], (old) => [...(old || []), newLog]);
    };
    setAddLog(() => addNewLog);
  }, [queryClient, setAddLog, date]);

  const handleTaskToggle = (log: LogItem, taskIndex: number) => {
    const updatedTasks = [...log.tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], checked: !updatedTasks[taskIndex].checked };
    updateLogMutation.mutate({ id: log.id, updates: { tasks: updatedTasks } });
  };

  const handleSaveDescription = (logId: number) => {
    updateLogMutation.mutate({ id: logId, updates: { description: editedDescription } });
    setEditingId(null);
  };

  const showMoreLogs = () => {
    setVisibleLogIndex((prev) => Math.min(prev + logsPerPage, logs.length - logsPerPage));
  };

  const showPreviousLogs = () => {
    setVisibleLogIndex((prev) => Math.max(prev - logsPerPage, 0));
  };

  const visibleLogs = logs.slice(visibleLogIndex, visibleLogIndex + logsPerPage);

  if (datesLoading || logsLoading) return <div>Loading...</div>;
  if (datesError) return <div>Error loading dates: {(datesError as Error).message}</div>;
  if (logsError) return <div>Error loading logs: {(logsError as Error).message}</div>;

  return (
    <div className="flex flex-col sm:h-screen sm:mb-10">
      <h3 className="underline-offset-8 underline decoration-white decoration-2">Logs for {date.date}</h3>

      <div className="flex justify-center sticky top-0 z-10 p-2">
        {visibleLogIndex > 0 && <ArrowUp onClick={showPreviousLogs} />}
      </div>

      <div className="flex-grow overflow-y-auto">
        {visibleLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full">No logs for this date.</div>
        ) : (
          visibleLogs.map((logItem) => (
            <div key={logItem.id} className="p-4 bg-[rgb(var(--color-bg-tertiary))] relative">
              {editingId !== logItem.id && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingId(logItem.id);
                      setEditedDescription(logItem.description);
                    }}
                    variant="tertiary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteLogMutation.mutate(logItem.id)}
                    variant="delete"
                  >
                    Delete
                  </Button>
                </div>
              )}

              <h3 className="font-bold text-lg mb-1">{logItem.title}</h3>
              <p>⏱ Time Left: {logItem.timer_leftover}</p>

              {editingId === logItem.id ? (
                <div className="mb-2">
                  <textarea
                    className="w-full p-2 border rounded text-black"
                    rows={3}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() => handleSaveDescription(logItem.id)}
                      className="bg-green-500 px-3 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 px-3 py-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-2">
                  <p className="whitespace-pre-wrap">📘 {logItem.description}</p>
                </div>
              )}

              {logItem.tasks?.length > 0 && (
                <div>
                  <p className="font-semibold">✅ Tasks:</p>
                  <ul className="list-disc ml-5">
                    {logItem.tasks.map((task, i) => (
                      <li key={i}>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.checked}
                            onChange={() => handleTaskToggle(logItem, i)}
                          />
                          <span className={task.checked ? "line-through text-gray-300" : ""}>
                            {task.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
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