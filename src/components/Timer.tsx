import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "../index.css";
import Button from "./Button";
import type { MyTimerProps, Task } from "../types/types";

export default function Timer({ expiryTimestamp, onRestart }: Readonly<MyTimerProps>) {
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [title, setTitle] = useState<string>("");
  const [timerDescription, setTimerDescription] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: expiryTimestamp || new Date(),
  });

  const handleStart = () => {
    if (showInputs) {
      const newExpiryTime = new Date();
      newExpiryTime.setHours(newExpiryTime.getHours() + customTime.hours);
      newExpiryTime.setMinutes(newExpiryTime.getMinutes() + customTime.minutes);
      newExpiryTime.setSeconds(newExpiryTime.getSeconds() + customTime.seconds);
      restart(newExpiryTime);
      setShowInputs(false);
      start();
    } else {
      start();
    }
  };

  const handleRestart = () => {
    const leftoverTimeInMs = hours * 3600000 + minutes * 60000 + seconds * 1000;
    const customTimeInMs =
      customTime.hours * 3600000 + customTime.minutes * 60000 + customTime.seconds * 1000;

    const differenceInMs = customTimeInMs - leftoverTimeInMs;

    const formatTime = (ms: number) => {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    };

    const difference = formatTime(differenceInMs);
    const currentDescription = timerDescription;

    if (onRestart) {
      onRestart(difference, title, currentDescription, tasks);
    }

    setShowInputs(true);
    setTimerDescription("");
    setTitle("");
    setTasks([]);
  };

  const toggleTaskChecked = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].checked = !updatedTasks[index].checked;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h2 className="mb-4">Timer</h2>

      {showInputs && (
        <>
          <input
            type="number"
            className="ml-2 mr-2 p-2 bg-[rgb(var(--color-secondary))]"
            placeholder="Hours"
            value={customTime.hours}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                hours: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />
          <input
            type="number"
            className="ml-2 mr-2 p-2 bg-[rgb(var(--color-secondary))]"
            placeholder="Minutes"
            value={customTime.minutes}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                minutes: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />
          <input
            type="number"
            className="ml-2 mr-2 p-2 bg-[rgb(var(--color-secondary))]"
            placeholder="Seconds"
            value={customTime.seconds}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                seconds: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />

          <div className="my-4">
            <h3>Title</h3>
          
          <input
            type="text"
            className="ml-2 mr-2 mb-2 p-2 w-full max-w-xl bg-[rgb(var(--color-secondary))]"
            placeholder="Title for this entry"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /></div>

          <div className="my-4">
            <h3>Description of activity</h3>
          
          <textarea
            className="mx-2 p-2 w-full max-w-xl bg-[rgb(var(--color-secondary))]"
            placeholder="What are you going to do?"
            value={timerDescription}
            onChange={(e) => setTimerDescription(e.target.value)}
            rows={4}
            wrap="soft"
          /></div>
        </>
      )}

      {(tasks.length > 0 || showInputs) && (
        <div className="my-4">
          <h3>Subtasks</h3>
        
      <div className="ml-2 my-2">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={() => toggleTaskChecked(index)}
              disabled={false}
            />
            <span className={task.checked ? "line-through" : ""}>{task.text}</span>
            {showInputs && (
              <Button variant="delete" size="sm"
                onClick={() => handleDeleteTask(index)}
              >
                X
              </Button>
            )}
          </div>
        ))}

        {showInputs && (
          <div className="flex gap-2 my-4">
            <input
              type="text"
              className="p-1 bg-[rgb(var(--color-secondary))] flex-1"
              placeholder="New task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <Button
              onClick={() => {
                if (newTaskText.trim() !== "") {
                  setTasks([...tasks, { text: newTaskText.trim(), checked: false }]);
                  setNewTaskText("");
                }
              }}
            >
              Add
            </Button>
          </div>
        )}
      </div>
      </div>
      )}

      {showInputs ? (
        <Button onClick={handleStart} variant="tertiary" size="lg">Start</Button>
      ) : (
        <div>
          <div>
            <h3>{title}</h3>
            <p className="text-5xl my-2">
              {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
            </p>
            <p className="my-4">{isRunning ? "Running" : "Not running"}</p>
          </div>
          <div>
          <Button onClick={pause} className="mx-1" variant="tertiary" size="lg">Pause</Button>
          <Button onClick={resume} className="mx-1" variant="tertiary" size="lg">Resume</Button>
          <Button onClick={handleRestart} className="mx-1" variant="tertiary" size="lg">Restart</Button>
        </div></div>
      )}
    </div>
  );
}
