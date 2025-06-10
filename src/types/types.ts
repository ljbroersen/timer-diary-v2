export type ArrowProps = {
  onClick?: () => void;
  className?: string;
};

export interface NavigationProps {
  dates: DateRecord[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  setVisibleLogIndex?: (index: number) => void;
}

export type LogItem = {
  id: number;
  date_id: number;
  date: string;
  session_duration: string;
  title: string;
  description: string;
  tasks: { text: string; checked: boolean }[];
};

export type DateRecord = {
  id: number;
  date: string;
};

export interface MyLogProps {
  URL: string;
  date: DateRecord;
  setDiaryDates: (dates: DateRecord[]) => void;
  setAddLog: (addLog: (log: LogItem) => void) => void;
}

export interface Task {
  text: string;
  checked: boolean;
}

export interface MyTimerProps {
  expiryTimestamp?: Date;
  onFinish?: (
    difference: string,
    title: string,
    description: string,
    tasks: Task[]
  ) => void;
}