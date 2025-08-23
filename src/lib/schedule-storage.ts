import { ScheduleItem } from "@/types/schedule";

const STORAGE_KEY = "vtuber-schedule";

export const loadSchedule = (): ScheduleItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSchedule = (schedule: ScheduleItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
};