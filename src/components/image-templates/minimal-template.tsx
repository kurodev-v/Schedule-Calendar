import React from 'react';
import { ScheduleItem } from '@/types/schedule';
import { format, parseISO } from 'date-fns';

interface MinimalTemplateProps {
  scheduleItem: ScheduleItem;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ scheduleItem }) => {
  return (
    <div
      id="capture-area" // html2canvasでキャプチャする要素
      className="w-[1280px] h-[720px] bg-white flex flex-col justify-center items-center p-10 relative overflow-hidden"
      style={{ fontFamily: 'sans-serif' }} // フォントは後で調整
    >
      {/* 背景のシンプルなデザイン要素 */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-200 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/3 bg-pink-200 opacity-50"></div>

      <h1 className="text-6xl font-bold text-gray-800 mb-8 z-10">
        {scheduleItem.title}
      </h1>
      <p className="text-4xl text-gray-700 mb-4 z-10">
        {format(scheduleItem.date, 'yyyy年M月d日 (EEE)')}
      </p>
      <p className="text-3xl text-gray-600 mb-8 z-10">
        カテゴリ: {scheduleItem.category}
      </p>
      {scheduleItem.notes && (
        <p className="text-2xl text-gray-500 text-center max-w-3xl z-10">
          {scheduleItem.notes}
        </p>
      )}

      {/* ロゴやVTuber名などのプレースホルダー */}
      <div className="absolute bottom-10 left-10 text-gray-400 text-xl z-10">
        VTuber Name / Logo
      </div>
    </div>
  );
};

export default MinimalTemplate;
