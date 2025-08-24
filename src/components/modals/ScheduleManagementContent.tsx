import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ScheduleForm from "@/components/schedule-form";
import { ScheduleItem } from "@/types/schedule";
import { format } from 'date-fns';

interface ScheduleManagementContentProps {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
  editingItem?: ScheduleItem;
  selectedDate: Date | null;
  filteredSchedule: ScheduleItem[];
  sortedAllSchedule: ScheduleItem[];
  handleNewScheduleClick: () => void;
  handleAddOrUpdateSchedule: (item: ScheduleItem) => void;
  handleEditClick: (item: ScheduleItem) => void;
  handleDeleteSchedule: (id: string) => void;
  handleCopySNS: (item: ScheduleItem) => void;
}

const ScheduleManagementContent: React.FC<ScheduleManagementContentProps> = ({
  isFormOpen,
  setIsFormOpen,
  editingItem,
  selectedDate,
  filteredSchedule,
  sortedAllSchedule,
  handleNewScheduleClick,
  handleAddOrUpdateSchedule,
  handleEditClick,
  handleDeleteSchedule,
  handleCopySNS,
}) => {
  return (
    <div className="py-4">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 w-full" onClick={handleNewScheduleClick}>新しい予定を追加</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "予定を編集" : "新しい予定を追加"}</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            initialData={editingItem}
            initialDate={selectedDate || undefined}
            onSubmit={handleAddOrUpdateSchedule}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <h3 className="text-lg font-bold mt-4">選択日の予定:</h3>
      {filteredSchedule.length > 0 ? (
        <ul className="space-y-2 mt-2">
          {filteredSchedule.map((item) => (
            <li key={item.id} className={`${item.isCompleted ? "line-through text-gray-500" : ""} p-2 border rounded bg-white shadow-sm`}>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-600">時刻: {item.time || '未定'}</p>
              <p className="text-sm text-gray-600">{item.category} / {item.platform}</p>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>編集</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">削除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は元に戻せません。選択された予定を完全に削除します。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSchedule(item.id)}>削除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="sm" onClick={() => handleCopySNS(item)}>SNS投稿</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>この日の予定はありません。</p>
      )}
      <h3 className="text-lg font-bold mt-4">全ての予定 (日付順):</h3>
      {sortedAllSchedule.length > 0 ? (
        <ul className="space-y-2 mt-2">
          {sortedAllSchedule.map((item) => (
            <li key={item.id} className={`${item.isCompleted ? "line-through text-gray-500" : ""} p-2 border rounded bg-white shadow-sm`}>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-600">{format(new Date(item.date), "yyyy/MM/dd")} {item.time === '未定' || !item.time ? '(時刻未定)' : item.time} - {item.category}</p>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>編集</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">削除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は元に戻せません。選択された予定を完全に削除します。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSchedule(item.id)}>削除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="sm" onClick={() => handleCopySNS(item)}>SNS投稿</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>予定はまだありません。</p>
      )}
    </div>
  );
};

export default ScheduleManagementContent;