import { useState, useEffect } from 'react';
import Go_top from '../../Oth_compornents/go_top';

export default function Newcardmake() {
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    race: '',
    attack: '',
    defense: '',
    description: '',
    imageUrl: '',
    effect: ''
  });

  useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    // 入力が何かあれば警告
    const isDirty = Object.values(formData).some(v => v !== '');

    if (!isDirty) return;

    e.preventDefault();
    e.returnValue = '';
  };

  window.addEventListener('beforeunload', handler);
  return () => window.removeEventListener('beforeunload', handler);
}, [formData]);
  const [activeTab, setActiveTab] = useState<'basic' | 'effect'>('basic');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Card Data:', formData);
    // 送信処理はここに記載
  };

  return (
    <div className="w-full flex flex-col items-center flex-1 p-4">
      <h1 className="text-3xl font-bold mb-6">カード作成</h1>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* プレビュー */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="bg-white border-2 border-gray-800 rounded-lg shadow-lg p-4 w-full max-w-xs aspect-[2/3] flex flex-col justify-between text-gray-900">
            {/* カード画像 */}
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt="Card" 
                className="w-full h-40 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 border border-gray-300 rounded mb-2 flex items-center justify-center text-sm text-gray-500">
                画像を追加
              </div>
            )}

            {/* カード情報 */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{formData.name || '???'}</h2>
                <div className="text-xs space-y-1">
                  <p>⭐ Lv: {formData.level || '-'}</p>
                  <p>🐉 種族: {formData.race || '-'}</p>
                  <p>⚔️ 攻撃: {formData.attack || '-'}</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-700">
                <p className="line-clamp-3">{formData.description || '説明文がここに表示されます'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <div className="lg:col-span-2">
          {/* タブ */}
          <div className="flex border-b-2 border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'basic'
                  ? 'border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              基本情報
            </button>
            <button
              onClick={() => setActiveTab('effect')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'effect'
                  ? 'border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              効果
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報タブ */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                {/* 名前 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">カード名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="カードの名前を入力"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 画像URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2">画像URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* レベル */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">レベル</label>
                    <input
                      type="number"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      placeholder="1-12"
                      min="1"
                      max="12"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 攻撃力 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">攻撃力</label>
                    <input
                      type="number"
                      name="attack"
                      value={formData.attack}
                      onChange={handleInputChange}
                      placeholder="0-9999"
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 種族 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">種族</label>
                  <input
                    type="text"
                    name="race"
                    value={formData.race}
                    onChange={handleInputChange}
                    placeholder="例: ドラゴン, 戦士, 魔法使い"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 説明 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">説明文</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="カードの説明を入力"
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 効果タブ */}
            {activeTab === 'effect' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">カード効果</label>
                  <textarea
                    name="effect"
                    value={formData.effect}
                    onChange={handleInputChange}
                    placeholder="カードの効果・スキルを詳しく記入してください"
                    rows={8}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-sm text-gray-700">💡 後から効果の設定方法を決めていきます</p>
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded font-semibold transition-all hover:bg-blue-600 active:translate-y-0.5"
              >
                カードを保存
              </button>
              <button
                type="reset"
                className="px-6 py-3 border-2 border-gray-400 rounded font-semibold transition-all hover:bg-gray-100"
              >
                リセット
              </button>
            </div>
          </form>

          <div className="mt-8">
            <Go_top />
          </div>
        </div>
      </div>
    </div>
  );
}