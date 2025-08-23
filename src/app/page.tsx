"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Calendar from "@/components/calendar";
import { format, isSameDay, compareAsc } from "date-fns";
import { ScheduleItem } from "@/types/schedule";
import { loadSchedule, saveSchedule } from "@/lib/schedule-storage";
import ScheduleForm from "@/components/schedule-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MinimalTemplate from "@/components/image-templates/minimal-template";
import GamersTemplate from "@/components/image-templates/gamers-template";
import { toPng, toJpeg } from 'html-to-image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>(undefined);
  const [selectedTemplateItem, setSelectedTemplateItem] = useState<ScheduleItem | undefined>(undefined);
  const captureRef = useRef<HTMLDivElement>(null);
  const [snsTemplate, setSnsTemplate] = useState('');
  const [favoriteHashtags, setFavoriteHashtags] = useState('');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("schedule-management");
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');

  useEffect(() => {
    setSchedule(loadSchedule());
    const storedSnsTemplate = localStorage.getItem('snsTemplate');
    if (storedSnsTemplate) {
      setSnsTemplate(storedSnsTemplate);
    } else {
      setSnsTemplate("📢【${title}】配信のお知らせ📢\n\n🗓️日時: ${date} ${time}\n📍場所: ${platform}\n📝内容: ${notes}\n\n#${hashtag_title}\n#${hashtag_vtuber}");
    }

    const storedFavoriteHashtags = localStorage.getItem('favoriteHashtags');
    if (storedFavoriteHashtags) {
      setFavoriteHashtags(storedFavoriteHashtags);
    }
  }, []);

  useEffect(() => {
    saveSchedule(schedule);
    localStorage.setItem('snsTemplate', snsTemplate);
    localStorage.setItem('favoriteHashtags', favoriteHashtags);
  }, [schedule, snsTemplate, favoriteHashtags]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDateDoubleClick = (date: Date) => {
    setSelectedDate(date);
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleAddOrUpdateSchedule = (item: ScheduleItem) => {
    if (editingItem) {
      setSchedule((prev) =>
        prev.map((s) => (s.id === item.id ? item : s))
      );
      setEditingItem(undefined);
    } else {
      setSchedule((prev) => [...prev, item]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditClick = (item: ScheduleItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleNewScheduleClick = () => {
    setEditingItem(undefined);
    setSelectedDate(new Date());
    setIsFormOpen(true);
  };

  const handleCopySNS = (item: ScheduleItem) => {
    const template = snsTemplate || "";
    const timeString = item.time === '未定' || !item.time ? '未定' : `${item.time}～`;
    let finalContent = template
      .replace(/\${{\s*title\s*}}/g, item.title)
      .replace(/\${{\s*date\s*}}/g, format(new Date(item.date), "yyyy-MM-dd"))
      .replace(/\${{\s*time\s*}}/g, timeString)
      .replace(/\${{\s*category\s*}}/g, item.category)
      .replace(/\${{\s*notes\s*}}/g, item.notes || '特になし')
      .replace(/\${{\s*platform\s*}}/g, item.platform)
      .replace(/\${{\s*hashtag_title\s*}}/g, item.title.replace(/\s/g, ''))
      .replace(/\${{\s*hashtag_vtuber\s*}}/g, '#Vtuber');

    const hashtagsToAdd = favoriteHashtags.split(' ').filter(tag => tag.startsWith('#') && tag.length > 1).join(' ');
    finalContent += (hashtagsToAdd ? `\n${hashtagsToAdd}` : '');

    navigator.clipboard.writeText(finalContent);

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(finalContent)}`;
    window.open(tweetUrl, '_blank');
  };

  const handleCaptureImage = async (formatType: 'png' | 'jpeg') => {
    if (!captureRef.current) return;

    let dataUrl: string | undefined;
    const options = {
        pixelRatio: 2,
        width: 1280,
        height: 720,
    };

    if (formatType === 'png') {
      dataUrl = await toPng(captureRef.current, options);
    } else if (formatType === 'jpeg') {
      dataUrl = await toJpeg(captureRef.current, { ...options, quality: 0.95 });
    }

    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `vtuber_schedule.${formatType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredSchedule = selectedDate
    ? schedule.filter((item) => isSameDay(new Date(item.date), selectedDate))
    : [];

  const sortedAllSchedule = [...schedule].sort((a, b) =>
    compareAsc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-grow p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">カレンダー表示エリア</h1>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'week' | 'day')} className="mb-4">
          <TabsList>
            <TabsTrigger value="month" className="px-6 py-2 text-base">月</TabsTrigger>
            <TabsTrigger value="week" className="px-6 py-2 text-base">週</TabsTrigger>
            <TabsTrigger value="day" className="px-6 py-2 text-base">日</TabsTrigger>
          </TabsList>
        </Tabs>
        <Calendar
          onDateClick={handleDateClick}
          onDateDoubleClick={handleDateDoubleClick}
          viewMode={viewMode}
          schedule={schedule}
        />
        <div className="md:hidden mt-4 p-4 bg-gray-200 border-t border-gray-300">
          <h2 className="text-xl font-bold mb-4">選択日の予定一覧</h2>
          {selectedDate && (
            <p>選択中の日付の予定を表示: {format(selectedDate, "yyyy年M月d日")}</p>
          )}
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
        </div>
      </div>
      <div className="relative hidden md:block">
        {isSidePanelOpen ? (
          <div className={`bg-gray-200 border-l border-gray-300 h-full transition-all duration-300 ease-in-out overflow-hidden w-[25vw] p-4`}>
            <Button 
              onClick={() => setIsSidePanelOpen(false)}
              className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 rounded-full w-8 h-8 p-0 bg-gray-300 hover:bg-gray-400 shadow-md"
            >
              {'<'} 
            </Button>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule-management">予定管理</TabsTrigger>
                <TabsTrigger value="image-settings">画像設定</TabsTrigger>
                <TabsTrigger value="sns-templates">SNSテンプレート</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule-management" className="max-h-[calc(100vh-80px)] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">予定管理</h2>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="mb-4" onClick={handleNewScheduleClick}>新しい予定を追加</Button>
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
              </TabsContent>
              <TabsContent value="image-settings">
                <h2 className="text-xl font-bold mb-4">画像設定</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">1. テンプレートを選択:</h3>
                    <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value)}>
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
                  <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">プレビュー:</h3>
                    <div className="border border-gray-300 p-2 max-h-[400px] overflow-y-auto">
                      <div ref={captureRef} className="w-full">
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
              </TabsContent>
              <TabsContent value="sns-templates" className="max-h-[calc(100vh-40px)] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">SNSテンプレート</h2>
                <p className="text-gray-600 mb-4">
                  イベント情報に基づいて自動生成されるSNS投稿文のテンプレートを編集できます。
                  以下の変数が利用可能です:
                </p>
                <ul className="list-disc list-inside text-gray-500 mb-4 space-y-1">
                  <li><code className="bg-gray-200 p-1 rounded">${'{title}'}</code>: 予定タイトル</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{date}'}</code>: 予定日付 (例: 2025-08-22)</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{time}'}</code>: 予定時刻 (例: 20:00～ または 未定)</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{category}'}</code>: カテゴリ</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{notes}'}</code>: メモ</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{platform}'}</code>: プラットフォーム</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{hashtag_title}'}</code>: タイトルを元にしたハッシュタグ (例: #イベントタイトル)</li>
                  <li><code className="bg-gray-200 p-1 rounded">${'{hashtag_vtuber}'}</code>: 固定ハッシュタグ #Vtuber</li>
                </ul>
                <textarea
                  value={snsTemplate}
                  onChange={(e) => setSnsTemplate(e.target.value)}
                  rows={10}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SNS投稿文のテンプレートを編集できます。"
                ></textarea>
                <h3 className="text-lg font-bold mt-6 mb-2">お気に入りハッシュタグ</h3>
                <p className="text-gray-600 mb-2">
                  投稿に含めたいお気に入りのハッシュタグをスペース区切りで入力してください。
                </p>
                <Input
                  value={favoriteHashtags}
                  onChange={(e) => setFavoriteHashtags(e.target.value)}
                  placeholder="例: #Vtuber #ゲーム実況"
                  className="mb-4"
                />
                <Button
                  className="mt-4"
                  onClick={() => {
                    localStorage.setItem('snsTemplate', snsTemplate);
                    localStorage.setItem('favoriteHashtags', favoriteHashtags);
                    alert('テンプレートとハッシュタグを保存しました！');
                  }}
                >
                  テンプレートとハッシュタグを保存
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="relative w-12 h-full bg-gray-200 border-l border-gray-300 flex flex-col items-center py-4 space-y-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab("schedule-management");
                setIsSidePanelOpen(true);
              }}
              title="予定管理"
            >
              🗓️
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab("image-settings");
                setIsSidePanelOpen(true);
              }}
              title="画像設定"
            >
              🖼️
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab("sns-templates");
                setIsSidePanelOpen(true);
              }}
              title="SNSテンプレート"
            >
              ✍️
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}