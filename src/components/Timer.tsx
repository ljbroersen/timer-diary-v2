import { useTimer } from "react-timer-hook";
import { useState, useMemo, useEffect } from "react";
import "../index.css";
import Button from "./Button";
import type { MyTimerProps, Task } from "../types/types";

export default function Timer({ expiryTimestamp, onFinish }: Readonly<MyTimerProps>) {
  const [showInputs, setShowInputs] = useState(true);
  const [customTime, setCustomTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [title, setTitle] = useState("");
  const [timerDescription, setTimerDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: expiryTimestamp || new Date(),
  });

  const totalTimerDurationMs = useMemo(() => (
    customTime.hours * 3600000 + customTime.minutes * 60000 + customTime.seconds * 1000
  ), [customTime]);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (showInputs) {
      const newExpiry = new Date();
      newExpiry.setSeconds(newExpiry.getSeconds() + totalTimerDurationMs / 1000);
      restart(newExpiry);
      setShowInputs(false);
      start();
    } else {
      start();
    }
  };

  const handleFinish = () => {
    const timeLeftMs = hours * 3600000 + minutes * 60000 + seconds * 1000;
    const timeSpentMs = totalTimerDurationMs - timeLeftMs;
    const formattedTimeSpent = formatTime(timeSpentMs);

    onFinish?.(formattedTimeSpent, title, timerDescription, tasks);

    setShowInputs(true);
    setTitle("");
    setTimerDescription("");
    setTasks([]);
  };

  const handleTaskChange = (index: number) => {
    setTasks(tasks.map((t, i) => i === index ? { ...t, checked: !t.checked } : t));
  };

  const handleTaskDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (newTaskText) {
      setTasks([...tasks, { text: newTaskText, checked: false }]);
      setNewTaskText("");
    }
  };

  const updateCustomTime = (unit: "hours" | "minutes" | "seconds", value: string) => {
    setCustomTime({ ...customTime, [unit]: value === "" ? 0 : parseInt(value) });
  };

  useEffect(() => {
  if (!isRunning && hours === 0 && minutes === 0 && seconds === 0 && !showInputs) {
    setShowTimeUpModal(true);
  }
}, [hours, minutes, seconds, isRunning, showInputs]);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Timer</h2>
      {showInputs && (
        <>
          {["hours", "minutes", "seconds"].map((unit) => (
            <input
              key={unit}
              type="number"
              className="ml-2 mr-2 p-2 border border-black shadow-md rounded-xl bg-[rgb(var(--color-secondary))]"
              placeholder={unit.charAt(0).toUpperCase() + unit.slice(1)}
              value={customTime[unit as keyof typeof customTime]}
              onChange={(e) => updateCustomTime(unit as any, e.target.value)}
            />
          ))}
          <div className="my-4">
            <h3 className="mb-2 font-semibold text-lg">Title</h3>
            <input
              type="text"
              className="ml-2 mr-2 mb-2 p-2 w-full max-w-xl border border-black shadow-md rounded-xl bg-[rgb(var(--color-secondary))]"
              placeholder="Title for this entry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="my-4">
            <h3 className="mb-2 font-semibold text-lg">Description of activity</h3>
            <textarea
              className="mx-2 p-2 w-full max-w-xl border border-black shadow-md rounded-xl bg-[rgb(var(--color-secondary))]"
              placeholder="What are you going to do?"
              value={timerDescription}
              onChange={(e) => setTimerDescription(e.target.value)}
              rows={4}
              wrap="soft"
            />
          </div>
        </>
      )}
      {(showInputs || tasks.length > 0) && (
        <div className="my-4">
          <h3 className="mb-2 font-semibold text-lg">Subtasks</h3>
          <div className="flex justify-center">
            <div className="space-y-2 w-1/2">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl shadow-sm bg-[rgb(var(--color-bg-primary))]"
                >
                  {!showInputs && (
                    <input
                      type="checkbox"
                      checked={task.checked}
                      onChange={() => handleTaskChange(i)}
                      className="w-5 h-5 cursor-pointer accent-[rgb(var(--color-accent))]"
                    />
                  )}
                  <span className="text-[rgb(var(--color-text-base))] text-lg">
                    {task.text}
                  </span>
                  {showInputs && (
                    <Button
                      variant="delete"
                      size="sm"
                      onClick={() => handleTaskDelete(i)}
                      className="flex-shrink-0"
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {showInputs && (
            <div className="flex justify-center gap-2 mt-3 ml-2">
              <input
                type="text"
                className="p-2 border border-black shadow-md rounded-xl bg-[rgb(var(--color-secondary))] flex-1"
                placeholder="New task"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <Button onClick={addTask} variant="primary" size="md">
                Add
              </Button>
            </div>
          )}
        </div>
      )}
      {showInputs ? (
        <Button onClick={handleStart} variant="tertiary" size="lg">Start</Button>
      ) : (
        <>
          <div>
            <h3>{title}</h3>
            <p className="text-7xl my-2">{`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}</p>
            <p className="text-lg my-4">{isRunning ? "Running..." : "Not running"}</p>
          </div>
          <div>
            <Button onClick={pause} className="mx-1" variant="tertiary" size="lg">Pause</Button>
            <Button onClick={resume} className="mx-1" variant="tertiary" size="lg">Resume</Button>
            <Button onClick={handleFinish} className="mx-1" variant="tertiary" size="lg">Finish</Button>
          </div>
        </>
      )}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-[rgb(var(--color-bg-tertiary))]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--color-text-base))]">Done!</h2>
            <p className="mb-6 text-[rgb(var(--color-text-base))]">The timer has ended. Please take a break!</p>
            <Button onClick={() => setShowTimeUpModal(false)} variant="primary" size="md">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}