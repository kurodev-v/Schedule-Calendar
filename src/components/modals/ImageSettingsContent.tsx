import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MinimalTemplate from "@/components/image-templates/minimal-template";
import GamersTemplate from "@/components/image-templates/gamers-template";
import { ScheduleItem } from '@/types/schedule';
import { format } from 'date-fns';

interface ImageSettingsContentProps {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  schedule: ScheduleItem[];
  sortedAllSchedule: ScheduleItem[];
  setSelectedTemplateItem: (item: ScheduleItem | undefined) => void;
  selectedTemplateItem: ScheduleItem | undefined;
  captureRef: React.RefObject<HTMLDivElement | null>;
  handleCaptureImage: (format: 'png' | 'jpeg') => void;
}

const ImageSettingsContent: React.FC<ImageSettingsContentProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  schedule,
  sortedAllSchedule,
  setSelectedTemplateItem,
  selectedTemplateItem,
  captureRef,
  handleCaptureImage,
}) => {
  return (
    <div className="py-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold mb-2">1. テンプレートを選択:</h3>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="テンプレートを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">ミニマル</SelectItem>
              <SelectItem value="gamers">ゲーマーズ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">2. 予定を選択:</h3>
          <Select onValueChange={(value) => setSelectedTemplateItem(schedule.find(item => item.id === value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="予定を選択" />
            </SelectTrigger>
            <SelectContent>
              {sortedAllSchedule.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {format(new Date(item.date), "yyyy/MM/dd")} - {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedTemplateItem ? (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-bold mb-2">プレビュー:</h3>
          <div className="border border-gray-300 p-2 max-h-[50vh] overflow-y-auto overflow-x-auto w-[calc(100vw-5rem)] sm:w-full">
            <div ref={captureRef} className="inline-block">
              {selectedTemplate === 'minimal' && <MinimalTemplate scheduleItem={selectedTemplateItem} />}
              {selectedTemplate === 'gamers' && <GamersTemplate scheduleItem={selectedTemplateItem} />}
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={() => handleCaptureImage('png')}>PNGでダウンロード</Button>
            <Button onClick={() => handleCaptureImage('jpeg')}>JPEGでダウンロード</Button>
          </div>
        </div>
      ) : (
        <p className="mt-4">テンプレートと予定を選択してください。</p>
      )}
    </div>
  );
};

export default ImageSettingsContent;
