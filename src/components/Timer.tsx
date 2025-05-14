import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "../index.css";
import Button from "./Button";

interface MyTimerProps {
  expiryTimestamp?: Date;
  onRestart?: (difference: string, description: string) => void;
}

export default function Timer({ expiryTimestamp, onRestart }: Readonly<MyTimerProps>) {
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [title, setTitle] = useState<string>("");
  const [timerDescription, setTimerDescription] = useState<string>("");

  const [tasks, setTasks] = useState<Array<{ text: string; checked: boolean }>>([]);
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
      onRestart(difference, currentDescription);
    }

    setShowInputs(true);
    setTimerDescription("");
    setTitle("");
    setTasks([]);
  };

  const handleAddTask = () => {
    if (newTaskText.trim() !== "") {
      setTasks([...tasks, { text: newTaskText.trim(), checked: false }]);
      setNewTaskText("");
    }
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
      <h2 className="mb-5">Timer</h2>
      {showInputs ? (
        <div>
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

          <p className="m-2">
            <strong>Title</strong>
          </p>
          <input
            type="text"
            className="ml-2 mr-2 mb-2 p-2 w-full max-w-xl bg-[rgb(var(--color-secondary))]"
            placeholder="Title for this entry"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="m-2">
            <strong>Description of activity</strong>
          </p>
          <textarea
            className="ml-2 mr-2 mb-2 p-2 w-full max-w-xl bg-[rgb(var(--color-secondary))]"
            placeholder="What are you going to do?"
            value={timerDescription}
            onChange={(e) => setTimerDescription(e.target.value)}
            rows={4}
            wrap="soft"
          />

          <p className="m-2">
            <strong>Subtasks</strong>
          </p>
          <div className="ml-2 my-2">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-2 my-2">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => toggleTaskChecked(index)}
                />
                <span className={task.checked ? "line-through" : ""}>{task.text}</span>
                {showInputs && (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteTask(index)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <div className="flex gap-2 my-4">
              <input
                type="text"
                className="p-1 bg-[rgb(var(--color-secondary))] flex-1"
                placeholder="New task"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <Button onClick={handleAddTask}>Add</Button>
            </div>
          </div>

          <Button onClick={handleStart}>Start</Button>
        </div>
      ) : (
        <div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <span>
              {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
            </span>
          </div>

          <p>{isRunning ? "Running" : "Not running"}</p>
          <Button onClick={pause}>Pause</Button>
          <Button onClick={resume}>Resume</Button>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      )}
    </div>
  );
}
