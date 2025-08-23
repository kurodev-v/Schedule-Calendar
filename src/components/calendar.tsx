"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays, parseISO, subWeeks, addWeeks, subDays } from "date-fns";
import { ja } from 'date-fns/locale'; // 日本語ロケールをインポート
import { Button } from "@/components/ui/button";

import { ScheduleItem } from "@/types/schedule";

interface CalendarProps {
  onDateClick: (date: Date) => void;
  onDateDoubleClick: (date: Date) => void; // New prop
  viewMode: 'month' | 'week' | 'day';
  schedule: ScheduleItem[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, onDateDoubleClick, viewMode, schedule }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const header = () => {
    const dateFormat = viewMode === 'month' ? "yyyy年M月" : "yyyy年M月";
    const displayDate = viewMode === 'month' ? currentMonth : selectedDate;

    const handlePrev = () => {
      if (viewMode === 'month') {
        setCurrentMonth(subMonths(currentMonth, 1));
      } else if (viewMode === 'week') {
        setSelectedDate(subWeeks(selectedDate, 1));
      } else if (viewMode === 'day') {
        setSelectedDate(subDays(selectedDate, 1));
      }
    };

    const handleNext = () => {
      if (viewMode === 'month') {
        setCurrentMonth(addMonths(currentMonth, 1));
      } else if (viewMode === 'week') {
        setSelectedDate(addWeeks(selectedDate, 1));
      } else if (viewMode === 'day') {
        setSelectedDate(addDays(selectedDate, 1));
      }
    };

    const prevButtonLabel = viewMode === 'month' ? '前月' : viewMode === 'week' ? '前週' : '前日';
    const nextButtonLabel = viewMode === 'month' ? '次月' : viewMode === 'week' ? '次週' : '翌日';

    return (
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrev}>{prevButtonLabel}</Button>
        <h2 className="text-xl font-bold">{format(displayDate, dateFormat, { locale: ja })}</h2>
        <Button onClick={handleNext}>{nextButtonLabel}</Button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = [];
    const dateFormat = "E"; // 曜日を短縮形で表示 (例: 日)
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-sm" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ja })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <div
            className={`p-2 min-h-[120px] text-center cursor-pointer rounded-md ${
              !isSameMonth(cloneDay, currentMonth)
                ? "text-gray-400"
                : isSameDay(cloneDay, selectedDate)
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            key={cloneDay.toISOString()}
            onClick={() => {
              setSelectedDate(cloneDay);
              onDateClick(cloneDay);
            }}
            onDoubleClick={() => {
              onDateDoubleClick(cloneDay);
            }}
          >
            <span>{formattedDate}</span>
            <div className="text-xs mt-1">
              {schedule
                .filter(item => isSameDay(item.date, cloneDay))
                .map(item => (
                  <div key={item.id} className="bg-blue-200 text-blue-800 rounded-sm px-1 py-0.5 mb-0.5 truncate">
                    {item.time} {item.category}
                  </div>
                ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderWeeklyList = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const dailySchedule = schedule.filter(item => isSameDay(item.date, day));

      days.push(
        <div
          key={day.toISOString()}
          className={`flex items-start p-3 border-b cursor-pointer ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => {
            setSelectedDate(day);
            onDateClick(day);
          }}
          onDoubleClick={() => {
            onDateDoubleClick(day);
          }}
        >
          <div className="flex flex-col items-center mr-4">
            <span className="font-bold text-lg">{format(day, 'd')}</span>
            <span className="text-sm text-gray-600">({format(day, 'E', { locale: ja })})</span>
          </div>
          <div className="flex-grow">
            {dailySchedule.length > 0 ? (
              dailySchedule.map(item => (
                <div key={item.id} className="bg-blue-200 text-blue-800 rounded-sm px-2 py-1 mb-1 truncate">
                  {item.title} {item.time} {item.platform}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">予定なし</div>
            )}
          </div>
        </div>
      );
    }
    return <div className="border rounded-md">{days}</div>;
  };


  const dayCells = () => {
    const dailySchedule = schedule.filter(item => isSameDay(item.date, selectedDate));
    return (
       <div className="border rounded-md p-4">
         <h3 className="text-lg font-bold mb-2">{format(selectedDate, "M月d日 (E)", { locale: ja })}</h3>
         {dailySchedule.length > 0 ? (
            dailySchedule.map(item => (
              <div key={item.id} className="bg-blue-200 text-blue-800 rounded-sm px-2 py-1 mb-1 whitespace-normal">
                {item.title} {item.time} {item.category} {item.platform} {item.memo}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">予定なし</div>
          )}
       </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {header()}
      {viewMode === 'month' && (
        <>
          {daysOfWeek()}
          {cells()}
        </>
      )}
      {viewMode === 'week' && renderWeeklyList()}
      {viewMode === 'day' && dayCells()}
    </div>
  );
};

export default Calendar;
