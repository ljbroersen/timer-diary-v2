import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "../index.css";
import Button from "./Button";


interface MyTimerProps {
  expiryTimestamp?: Date;
  onRestart?: (difference: string, description: string) => void;
}

export default function Timer({
  expiryTimestamp,
  onRestart,
}: Readonly<MyTimerProps>) {
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerDescription, setTimerDescription] = useState<string>("");

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: expiryTimestamp || new Date(),
      // onExpire: () => alert("Finished!"),
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
      customTime.hours * 3600000 +
      customTime.minutes * 60000 +
      customTime.seconds * 1000;

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
  };

 return (
    <div>
        <p className="mb-5">
            <h2>Timer</h2>
        </p>
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
            <h2>Description of activity</h2>
          </p>
          <textarea
            className="ml-2 mr-2 mb-2 p-2 w-full max-w-xl bg-[rgb(var(--color-secondary))]"
            placeholder="What are you going to do?"
            value={timerDescription}
            onChange={(e) => setTimerDescription(e.target.value)}
            rows={4}
            wrap="soft"
          />

          <br />
          <Button onClick={handleStart}>Start</Button>
        </div>
      ) : (
        <div>
          <div className="">
            <span>
              {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
            </span>
          </div>

          <p className="">{isRunning ? "Running" : "Not running"}</p>
          <Button onClick={pause}>Pause</Button>
          <Button onClick={resume}>Resume</Button>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      )}
    </div>
  );
}