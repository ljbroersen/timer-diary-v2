import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "./Button";
import type { LogItem, DateRecord, MyLogProps } from "../types/types";

export default function Diary({ URL, date, setDiaryDates, setAddLog }: Readonly<MyLogProps>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

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
  }, [datesSuccess, dates, setDiaryDates]);

  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
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

  const toggleExpanded = (id: number) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  if (datesLoading || logsLoading) return <div>Loading...</div>;
  if (datesError) return <div>Error loading dates: {(datesError as Error).message}</div>;
  if (logsError) return <div>Error loading logs: {(logsError as Error).message}</div>;

  return (
    <div className="flex flex-col sm:h-screen sm:mb-10">
      {logs.length === 0 ? (
        <div className="flexh-full text-md">
          No logs for this date.
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex overflow-x-auto border-b mb-2">
            {logs.map((logItem) => (
              <button
                key={logItem.id}
                onClick={() => toggleExpanded(logItem.id)}
                className={`px-6 py-3 whitespace-nowrap text-base font-semibold border rounded-t-md mr-2 cursor-pointer ${
                  expandedLogId === logItem.id
                    ? "bg-[rgb(var(--color-bg-tertiary))] border-b-transparent"
                    : "bg-[rgb(var(--color-bg-primary))]"
                }`}
              >
                {/* #TODO: Edit title */}
                {logItem.title}
              </button>
            ))}
          </div>
          <div className="flex-grow overflow-y-auto">
            {logs
              .filter((log) => log.id === expandedLogId)
              .map((logItem) => (
                <div
                  key={logItem.id}
                  className="p-4 bg-[rgb(var(--color-bg-primary))] border rounded-md relative mb-4"
                >
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
                  <div className="flex flex-row mb-4">
                    <div className="flex items-center p-4 rounded w-3/5">
                      <p className="text-5xl font-bold">{logItem.session_duration}</p>
                    </div>
                    <div className="p-4 w-2/5">
                      <h3 className="font-semibold mb-1 text-left">Tasks:</h3>
                      {logItem.tasks.length > 0 ? (
                        <ul>
                          {logItem.tasks.map((task, i) => (
                            <li key={i}>
                              <label className="flex items-center gap-2 pb-2">
                                <input
                                  type="checkbox"
                                  checked={task.checked}
                                  onChange={() => handleTaskToggle(logItem, i)}
                                />
                                <span className={task.checked ? "line-through" : ""}>
                                  {task.text}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>You didn't specify any tasks!</p>
                      )}
                    </div>
                  </div>
                  {editingId === logItem.id ? (
                    <div className="mb-2">
                      <textarea
                        className="w-full p-2 border rounded text-black"
                        rows={3}
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                      <div className="mt-1 flex gap-2">
                        <Button onClick={() => handleSaveDescription(logItem.id)} variant="tertiary">
                          Save
                        </Button>
                        <Button onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <h3 className="font-bold">Description</h3>
                      <p className="whitespace-pre-wrap">{logItem.description}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}