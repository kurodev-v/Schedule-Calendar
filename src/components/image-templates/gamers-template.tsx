import { ScheduleItem } from "@/types/schedule";
import { format } from "date-fns";
import React from "react";

interface GamersTemplateProps {
  scheduleItem: ScheduleItem;
}

const GamersTemplate: React.FC<GamersTemplateProps> = ({ scheduleItem }) => {
  if (!scheduleItem) return null;

  const { title, date, time, category, platform, memo } = scheduleItem;

  return (
    <div className="w-[1280px] h-[720px] bg-gray-900 text-white font-sans p-12 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-4xl font-bold tracking-wider" style={{ backgroundImage: 'linear-gradient(to right, rgb(168 85 247), rgb(236 72 153))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {category}
          </span>
          <h1 className="text-7xl font-extrabold mt-2 tracking-tighter">{title}</h1>
        </div>
        <div className="text-3xl font-bold text-cyan-500 border-2 border-cyan-500 p-4 rounded-lg">
          {platform}
        </div>
      </div>

      {/* Center Content - Placeholder for Game Screenshot/Silhouette */}
      <div className="flex-grow my-8 flex items-center justify-center">
        <div className="w-full h-full bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
          <p className="text-gray-500">ゲーム画面のシルエットやアイコン配置スペース</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-2xl">{memo}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-black tracking-wide">{format(date, "MM/dd")} <span className="text-cyan-500">|</span> {time}</p>
          <p className="text-2xl font-semibold mt-1">STREAMING SOON</p>
        </div>
      </div>
    </div>
  );
};

export default GamersTemplate;
