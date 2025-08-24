import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SnsTemplatesContentProps {
  snsTemplate: string;
  setSnsTemplate: (template: string) => void;
  favoriteHashtags: string;
  setFavoriteHashtags: (hashtags: string) => void;
}

const SnsTemplatesContent: React.FC<SnsTemplatesContentProps> = ({
  snsTemplate,
  setSnsTemplate,
  favoriteHashtags,
  setFavoriteHashtags,
}) => {

  const handleSave = () => {
    localStorage.setItem('snsTemplate', snsTemplate);
    localStorage.setItem('favoriteHashtags', favoriteHashtags);
    alert('テンプレートとハッシュタグを保存しました！');
  };

  return (
    <div className="py-4">
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
        onClick={handleSave}
      >
        テンプレートとハッシュタグを保存
      </Button>
    </div>
  );
};

export default SnsTemplatesContent;
