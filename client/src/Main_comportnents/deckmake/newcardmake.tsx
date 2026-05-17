import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Go_top from '../../Oth_compornents/go_top';

// === AST関連の型定義（簡易版） ===
// このファイルではカード効果を「簡易AST（抽象構文木）風」に表現します。
// - フロントエンド上で効果を組み立て、JSON として保存/送信できるようにするための構造です。
// - 型はレビューや開発を分かりやすくするためにここで定義しています。実際のサーバ型に合わせて拡張してください。
type TargetType = 'character' | 'spell' | 'trap' | 'player' | 'card' | 'zone';
type QualifierType = 'owner' | 'timing' | 'event' | 'stat' | 'position' | 'zone' | 'count';
type EffectType = 'destroy' | 'draw' | 'search' | 'banish' | 'return_to_hand' | 'stat_change' | 'negate' | 'special_summon' | 'move';
type ZoneType = 'deck' | 'hand' | 'field' | 'graveyard' | 'banished' | 'extra_deck';

interface QualifierNode {
  id: string;
  qualifierType: QualifierType;
  value?: string | number;
  operator?: 'eq' | 'gte' | 'lte' | 'neq';
}

interface TargetNode {
  id: string;
  targetType: TargetType;
  qualifiers: QualifierNode[];
}

interface EffectNode {
  id: string;
  effectType: EffectType;
  target: TargetNode;
  value?: number;
  fromZone?: ZoneType;
  toZone?: ZoneType;
}

// Newcardmake コンポーネント
// - カードの基本情報入力フォームと、効果（AST）を組み立てるUIを提供します。
// - formData: カードの基本フィールド（名前/レベル/攻撃力等）
// - effects: 効果を表す配列（EffectNode の配列）
export default function Newcardmake() {
  // --- フォームの状態 ---
  // 各 input の name 属性とキーを一致させることで、handleInputChange で一元的に更新しています。
  // 例: <input name="power" /> は formData.power に保存されます。
  const [formData, setFormData] = useState({
    name: '',
    cardType:'character',
    level: '',
    race: '',
    power: '',
    flavortext:'',
    effect: '',
    imageUrl: '',
  });

  // --- 効果（AST） ---
  // EffectNode の配列として管理します。各要素は UI で編集可能な効果を表します。
  const [effects, setEffects] = useState<EffectNode[]>([]);

  // 新しい効果ノードを追加する（デフォルトは移動効果）
  // UI 上で追加ボタンを押したときに呼ばれます。
  const addEffect = () => {
    const newEffect: EffectNode = {
      id: `effect_${Date.now()}`,
      effectType: 'move',
      target: {
        id: `target_${Date.now()}`,
        targetType: 'card',
        qualifiers: []
      }
    };
    setEffects(prev => [...prev, newEffect]);
  };

  // 指定した効果（effectId）を配列から取り除く
  // UI 上の「効果を削除」ボタンで呼び出します。
  const removeEffect = (effectId: string) => {
    setEffects(prev => prev.filter(e => e.id !== effectId));
  };

  // 効果ノードそのもののプロパティを更新するユーティリティ
  // 例: effectType, value, fromZone, toZone など
  const updateEffect = (effectId: string, updates: Partial<EffectNode>) => {
    setEffects(prev => prev.map(effect =>
      effect.id === effectId ? { ...effect, ...updates } : effect
    ));
  };

  // 効果の対象 (target) 部分のみを差分更新するためのユーティリティ
  const updateTarget = (effectId: string, targetUpdates: Partial<TargetNode>) => {
    setEffects(prev => prev.map(effect =>
      effect.id === effectId ? {
        ...effect,
        target: { ...effect.target, ...targetUpdates }
      } : effect
    ));
  };

  // 対象に対する条件（Qualifier）を追加します。例: 所有者が〇〇、位置がフィールド、など
  const addQualifier = (effectId: string) => {
    const newQualifier: QualifierNode = {
      id: `qualifier_${Date.now()}`,
      qualifierType: 'zone'
    };
    setEffects(prev => prev.map(effect =>
      effect.id === effectId ? {
        ...effect,
        target: {
          ...effect.target,
          qualifiers: [...effect.target.qualifiers, newQualifier]
        }
      } : effect
    ));
  };

  // 既存の qualifier の内容を更新します（value や operator の変更など）
  const updateQualifier = (effectId: string, qualifierId: string, updates: Partial<QualifierNode>) => {
    setEffects(prev => prev.map(effect =>
      effect.id === effectId ? {
        ...effect,
        target: {
          ...effect.target,
          qualifiers: effect.target.qualifiers.map(q =>
            q.id === qualifierId ? { ...q, ...updates } : q
          )
        }
      } : effect
    ));
  };

  // 指定した qualifier を削除します
  const removeQualifier = (effectId: string, qualifierId: string) => {
    setEffects(prev => prev.map(effect =>
      effect.id === effectId ? {
        ...effect,
        target: {
          ...effect.target,
          qualifiers: effect.target.qualifiers.filter(q => q.id !== qualifierId)
        }
      } : effect
    ));
  };

  // 入力中にブラウザを閉じたりリロードすると入力が失われるため、未保存の変更がある場合に確認ダイアログを出す
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

  // 入力変更を一元管理するハンドラ
  // input/textarea/select の name 属性をキーとして formData を更新するシンプルな実装
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // フォーム送信時の処理（現在はデバッグ出力のみ）
  // 実運用ではここでバリデーション→API送信などを行います。
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Card Data:', formData);
    console.log('Effects AST:', effects);
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
                  <p>タイプ: {formData.cardType || '-'}</p>
                  <p>レベル: {formData.level || '-'}</p>
                  <p>種族: {formData.race || '-'}</p>
                  <p>パワー: {formData.power || '-'}</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-700">
                <p className="line-clamp-3">{formData.flavortext || '説明文がここに表示されます'}</p>
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
                <div className="grid grid-cols-3 gap-4">
                  {/* カード種類 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">カード種類</label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500">
                        <option value="character">キャラクター</option>
                        <option value="spell">スペル</option>
                        <option value="trap">トラップ</option>
                    </select>
                  </div>

                  {/* レベル */}
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
                      disabled={formData.cardType !== 'monster'}
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-blue-500 ${
                        formData.cardType !== 'monster'
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* 攻撃力 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">攻撃力</label>
                    <input
                      type="number"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      placeholder="0-9999"
                      min="0"
                      disabled={formData.cardType !== 'monster'}
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-blue-500 ${
                        formData.cardType !== 'monster'
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
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
                    name="flavortext"
                    value={formData.flavortext}
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">効果設定</h3>
                  <button
                    type="button"
                    onClick={addEffect}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                  >
                    + 効果を追加
                  </button>
                </div>

                {effects.map((effect, index) => (
                  <div key={effect.id} className="border border-gray-300 rounded p-4 space-y-4">
                    <h4 className="font-semibold">効果 {index + 1}</h4>
                    
                    {/* 対象選択 */}
                    <div className="flex items-center space-x-4">
                      <select
                        value={effect.target.targetType}
                        onChange={(e) => updateTarget(effect.id, { targetType: e.target.value as TargetType })}
                        className="px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="card">カード</option>
                        <option value="monster">モンスター</option>
                        <option value="spell">魔法</option>
                        <option value="trap">罠</option>
                        <option value="player">プレイヤー</option>
                        <option value="zone">ゾーン</option>
                      </select>
                      <span>が</span>
                      
                      {/* 資格追加ボタン */}
                      <button
                        type="button"
                        onClick={() => addQualifier(effect.id)}
                        className="text-blue-500 hover:text-blue-700 text-xl"
                      >
                        +
                      </button>
                    </div>

                    {/* 資格リスト */}
                    {effect.target.qualifiers.map((qualifier) => (
                      <div key={qualifier.id} className="flex items-center space-x-2 ml-4">
                        <select
                          value={qualifier.qualifierType}
                          onChange={(e) => updateQualifier(effect.id, qualifier.id, { qualifierType: e.target.value as QualifierType })}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="owner">所有者</option>
                          <option value="timing">タイミング</option>
                          <option value="event">イベント</option>
                          <option value="stat">ステータス</option>
                          <option value="position">位置</option>
                          <option value="zone">ゾーン</option>
                          <option value="count">数</option>
                        </select>
                        <input
                          type="text"
                          placeholder="値"
                          value={qualifier.value || ''}
                          onChange={(e) => updateQualifier(effect.id, qualifier.id, { value: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                        />
                        <button
                          type="button"
                          onClick={() => removeQualifier(effect.id, qualifier.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="資格を削除"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* 効果タイプ選択 */}
                    <div className="flex items-center space-x-4">
                      <span>を</span>
                      <select
                        value={effect.effectType}
                        onChange={(e) => updateEffect(effect.id, { effectType: e.target.value as EffectType })}
                        className="px-3 py-2 border border-gray-300 rounded"
                        aria-label={`効果タイプ-${index + 1}`}
                      >
                        <option value="move">移動</option>
                        <option value="destroy">破壊</option>
                        <option value="draw">ドロー</option>
                        <option value="search">サーチ</option>
                        <option value="banish">除外</option>
                        <option value="return_to_hand">手札に戻す</option>
                        <option value="stat_change">ステータス変更</option>
                        <option value="negate">無効</option>
                        <option value="special_summon">特殊召喚</option>
                      </select>
                      <span>する。</span>
                    </div>

                    {/* 移動効果の場合のゾーン選択 */}
                    {effect.effectType === 'move' && (
                      <div className="flex items-center space-x-4 ml-4">                      
                        <span>移動元:</span>
                        <select
                          value={effect.fromZone || ''}
                          onChange={(e) => updateEffect(effect.id, { fromZone: e.target.value as ZoneType })}
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">選択</option>
                          <option value="deck">デッキ</option>
                          <option value="hand">手札</option>
                          <option value="field">フィールド</option>
                          <option value="graveyard">墓地</option>
                          <option value="banished">除外</option>
                          <option value="extra_deck">EXデッキ</option>
                        </select>
                        <span>→ 移動先:</span>
                        <select
                          value={effect.toZone || ''}
                          onChange={(e) => updateEffect(effect.id, { toZone: e.target.value as ZoneType })}
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">選択</option>
                          <option value="deck">デッキ</option>
                          <option value="hand">手札</option>
                          <option value="field">フィールド</option>
                          <option value="graveyard">墓地</option>
                          <option value="banished">除外</option>
                          <option value="extra_deck">EXデッキ</option>
                        </select>
                      </div>
                    )}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeEffect(effect.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          効果を削除
                        </button>
                      </div>
                  </div>
                ))}

                {effects.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    効果が設定されていません。「+ 効果を追加」から追加してください。
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-sm text-gray-700">💡 AST形式で効果を構築しています。生成されたデータはJSONとして保存されます。</p>
                </div>
                {/* デバッグ用: フォームと効果の JSON プレビュー */}
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-xs">
                  <div className="font-semibold mb-2">現在のデータ（プレビュー）</div>
                  <pre className="whitespace-pre-wrap max-h-60 overflow-auto text-xs">{JSON.stringify({ formData, effects }, null, 2)}</pre>
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