"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleItem } from "@/types/schedule";

interface ScheduleFormProps {
  initialData?: ScheduleItem; // 編集時の初期データ
  initialDate?: Date; // 新規作成時の初期日付
  onSubmit: (data: ScheduleItem) => void;
  onCancel?: () => void;
}

// Zodスキーマを更新
const formSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です。" }),
  date: z.date({
    required_error: "日付は必須です。",
  }),
  time: z.string().optional(), // 時刻をオプショナルに変更
  category: z.string().optional(),
  platform: z.string().optional(),
  notes: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof formSchema>;

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  initialDate,
  onSubmit,
  onCancel,
}) => {
  // 時刻未定チェックボックスのstate
  const [isTimeUndecided, setIsTimeUndecided] = useState(
    !!initialData && initialData.time === "未定"
  );

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
          time: initialData.time === "未定" ? "" : initialData.time,
        }
      : {
          title: "",
          date: initialDate || new Date(),
          time: "19:00",
          category: "",
          platform: "",
          notes: "",
        },
  });

  // isTimeUndecided の変更を監視し、フォームの値を更新
  useEffect(() => {
    if (isTimeUndecided) {
      form.setValue("time", ""); // 時刻をクリア
      form.clearErrors("time"); // エラーもクリア
    }
  }, [isTimeUndecided, form]);


  const handleSubmit = (values: ScheduleFormValues) => {
    const dataToSubmit: ScheduleItem = {
      ...initialData,
      id: initialData?.id || crypto.randomUUID(),
      title: values.title || "未定",
      date: format(values.date, "yyyy-MM-dd"),
      time: isTimeUndecided ? "未定" : values.time || "", // 未定の場合「未定」をセット
      category: values.category || "未定",
      platform: values.platform || "未定",
      notes: values.notes || "",
      isCompleted: initialData?.isCompleted || false,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="予定のタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>日付</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy年M月d日")
                      ) : (
                        <span>日付を選択</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 時刻入力フィールド */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>時刻</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  disabled={isTimeUndecided} // チェックボックスで無効化
                  className={isTimeUndecided ? "bg-gray-200" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 時刻未定チェックボックス */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="time-undecided"
            checked={isTimeUndecided}
            onChange={(e) => setIsTimeUndecided(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="time-undecided"
            className="text-sm font-medium text-gray-700"
          >
            時刻は未定
          </label>
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="雑談">雑談</SelectItem>
                  <SelectItem value="歌枠">歌枠</SelectItem>
                  <SelectItem value="ゲーム">ゲーム</SelectItem>
                  <SelectItem value="コラボ">コラボ</SelectItem>
                  <SelectItem value="飲酒">飲酒</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プラットフォーム</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="プラットフォームを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Youtube">Youtube</SelectItem>
                  <SelectItem value="Twitch">Twitch</SelectItem>
                  <SelectItem value="IRIAM">IRIAM</SelectItem>
                  <SelectItem value="17LIVE">17LIVE</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea placeholder="備考" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          <Button type="submit">
            {initialData ? "更新" : "追加"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleForm;
