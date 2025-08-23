import { ScheduleItem } from "@/types/schedule";
import { parseISO } from "date-fns"; // Import parseISO

const STORAGE_KEY = "vtuber-schedule-data";

export const loadSchedule = (): ScheduleItem[] => {
  if (typeof window === "undefined") {
    return []; // サーバーサイドレンダリング時は空の配列を返す
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData: ScheduleItem[] = data ? JSON.parse(data) : [];
    return parsedData.map(item => ({
      ...item,
      import { ScheduleItem } from "@/types/schedule";

const STORAGE_KEY = "vtuber-schedule";

export const loadSchedule = (): ScheduleItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
    }));
  } catch (error) {
    console.error("Failed to load schedule from localStorage", error);
    return [];
  }
};

export const saveSchedule = (schedule: ScheduleItem[]) => {
  if (typeof window === "undefined") {
    return; // サーバーサイドレンダリング時は何もしない
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  } catch (error) {
    console.error("Failed to save schedule to localStorage", error);
  }
};
