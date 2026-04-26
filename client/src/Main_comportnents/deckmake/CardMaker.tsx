import { useState, useRef, } from "react";
import type {CSSProperties, ReactNode, ChangeEvent }  from "react";

// ─── 型定義 ───────────────────────────────────────────────

type CardTypeId = "fire" | "water" | "earth" | "dark" | "light";
type RarityId = "common" | "rare" | "super" | "legend";
type CardFrame = "standard" | "ornate" | "minimal" | "ancient";
type TabId = "basic" | "stats" | "design";
type StatKey = "atk" | "def" | "spd" | "mag";

interface CardType {
  id: CardTypeId;
  label: string;
  color: string;
  glow: string;
  bg: string;
  accent: string;
}

interface Rarity {
  id: RarityId;
  label: string;
  stars: number;
}

interface Stats {
  atk: number;
  def: number;
  spd: number;
  mag: number;
}

// ─── 定数 ────────────────────────────────────────────────

const CARD_TYPES: CardType[] = [
  { id: "fire",  label: "炎", color: "#ff6b35", glow: "#ff4500", bg: "linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #1a0a00 100%)", accent: "#ff9f6b" },
  { id: "water", label: "水", color: "#4fc3f7", glow: "#0288d1", bg: "linear-gradient(135deg, #001a2c 0%, #003a5c 50%, #001a2c 100%)", accent: "#81d4fa" },
  { id: "earth", label: "地", color: "#a5d6a7", glow: "#388e3c", bg: "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0a1a0a 100%)", accent: "#c8e6c9" },
  { id: "dark",  label: "闇", color: "#ce93d8", glow: "#7b1fa2", bg: "linear-gradient(135deg, #0d0014 0%, #1e003a 50%, #0d0014 100%)", accent: "#e1bee7" },
  { id: "light", label: "光", color: "#fff176", glow: "#f9a825", bg: "linear-gradient(135deg, #1a1500 0%, #3a3000 50%, #1a1500 100%)", accent: "#fff9c4" },
];

const RARITY: Rarity[] = [
  { id: "common", label: "コモン",       stars: 1 },
  { id: "rare",   label: "レア",         stars: 2 },
  { id: "super",  label: "スーパーレア", stars: 3 },
  { id: "legend", label: "レジェンド",   stars: 4 },
];

const CARD_FRAMES: CardFrame[] = ["standard", "ornate", "minimal", "ancient"];

const FRAME_LABEL: Record<CardFrame, string> = {
  standard: "スタンダード",
  ornate:   "オーネート",
  minimal:  "ミニマル",
  ancient:  "エンシェント",
};

const STAT_META: Record<StatKey, { label: string; icon: string }> = {
  atk: { label: "ATK 攻撃", icon: "⚔" },
  def: { label: "DEF 防御", icon: "🛡" },
  spd: { label: "SPD 速度", icon: "⚡" },
  mag: { label: "MAG 魔力", icon: "✦" },
};

const TYPE_EMOJI: Record<CardTypeId, string> = {
  fire:  "🔥",
  water: "💧",
  earth: "🌿",
  dark:  "🌑",
  light: "✨",
};

const initialStats: Stats = { atk: 50, def: 50, spd: 50, mag: 50 };

// ─── CardPreview ─────────────────────────────────────────

interface CardPreviewProps {
  name: string;
  type: CardType;
  rarity: Rarity;
  stats: Stats;
  description: string;
  cost: number;
  frame: CardFrame;
  imageUrl: string | null;
}

function CardPreview({ name, type, rarity, stats, description, cost, frame, imageUrl }: CardPreviewProps) {
  const borderStyle: Record<CardFrame, string> = {
    standard: "2px solid",
    ornate:   "3px double",
    minimal:  "1px solid",
    ancient:  "2px solid",
  };

  const corners: Array<"topleft" | "topright" | "bottomleft" | "bottomright"> =
    ["topleft", "topright", "bottomleft", "bottomright"];

  const cornerStyle = (pos: string): CSSProperties => ({
    position: "absolute",
    ...(pos.includes("top")    ? { top: 4 }    : { bottom: 4 }),
    ...(pos.includes("left")   ? { left: 4 }   : { right: 4 }),
    width: 12,
    height: 12,
    border: `2px solid ${type.color}88`,
    ...(pos === "topleft"     ? { borderRight: "none", borderBottom: "none" } : {}),
    ...(pos === "topright"    ? { borderLeft:  "none", borderBottom: "none" } : {}),
    ...(pos === "bottomleft"  ? { borderRight: "none", borderTop:    "none" } : {}),
    ...(pos === "bottomright" ? { borderLeft:  "none", borderTop:    "none" } : {}),
  });

  const statItems: Array<{ k: string; v: number; icon: string }> = [
    { k: "ATK", v: stats.atk, icon: "⚔" },
    { k: "DEF", v: stats.def, icon: "🛡" },
    { k: "SPD", v: stats.spd, icon: "⚡" },
    { k: "MAG", v: stats.mag, icon: "✦" },
  ];

  return (
    <div style={{
      width: 280,
      minHeight: 420,
      borderRadius: frame === "minimal" ? 4 : 16,
      border: `${borderStyle[frame]} ${type.color}`,
      background: type.bg,
      boxShadow: `0 0 40px ${type.glow}66, 0 0 80px ${type.glow}22, inset 0 0 40px rgba(0,0,0,0.6)`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Cinzel', serif",
      position: "relative",
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: "12px 14px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${type.color}44`,
        background: "rgba(0,0,0,0.3)",
      }}>
        <div style={{
          background: type.color,
          color: "#0a0a0a",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 13,
        }}>{cost}</div>

        <div style={{
          flex: 1,
          textAlign: "center",
          color: type.accent,
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.1em",
          textShadow: `0 0 12px ${type.glow}`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          margin: "0 8px",
        }}>{name}</div>

        <div style={{
          border: `1px solid ${type.color}88`,
          borderRadius: 4,
          padding: "2px 8px",
          color: type.color,
          fontSize: 11,
          letterSpacing: "0.05em",
        }}>{type.label}</div>
      </div>

      {/* イラスト */}
      <div style={{
        height: 180,
        background: imageUrl ? "transparent" : `radial-gradient(ellipse at center, ${type.glow}33 0%, transparent 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {imageUrl
          ? <img src={imageUrl} alt="card illustration" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ fontSize: 64, opacity: 0.15, filter: `drop-shadow(0 0 20px ${type.glow})` }}>
              {TYPE_EMOJI[type.id]}
            </div>
        }
        {frame === "ornate" && corners.map((pos) => (
          <div key={pos} style={cornerStyle(pos)} />
        ))}
      </div>

      {/* ステータス */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 10px",
        borderTop: `1px solid ${type.color}33`,
        borderBottom: `1px solid ${type.color}33`,
        background: "rgba(0,0,0,0.4)",
      }}>
        {statItems.map(({ k, v, icon }) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 2 }}>{icon}</div>
            <div style={{ fontSize: 16, color: type.accent, fontWeight: 700, lineHeight: 1, textShadow: `0 0 8px ${type.glow}` }}>{v}</div>
            <div style={{ fontSize: 8, color: type.color, letterSpacing: "0.05em", marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* 説明 */}
      <div style={{
        flex: 1,
        padding: "10px 14px",
        fontFamily: "'Noto Serif JP', serif",
        fontSize: 10,
        color: "#aaa",
        lineHeight: 1.7,
        letterSpacing: "0.03em",
      }}>
        {description}
      </div>

      {/* フッター */}
      <div style={{
        padding: "6px 14px",
        borderTop: `1px solid ${type.color}22`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.3)",
      }}>
        <span style={{ fontSize: 9, color: type.color, letterSpacing: "0.2em" }}>CARD FORGE</span>
        <span style={{ color: type.color, fontSize: 11, letterSpacing: "0.1em" }}>
          {"★".repeat(rarity.stars)}
        </span>
        <span style={{ fontSize: 9, color: "#555" }}>{rarity.label}</span>
      </div>
    </div>
  );
}

// ─── FormGroup ───────────────────────────────────────────

interface FormGroupProps {
  label: string;
  children: ReactNode;
}

function FormGroup({ label, children }: FormGroupProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block",
        fontSize: 10,
        letterSpacing: "0.15em",
        color: "#666",
        marginBottom: 8,
        textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── CardMaker (メイン) ──────────────────────────────────

export default function CardMaker() {
  const [cardName,    setCardName]    = useState<string>("新しいカード");
  const [cardType,    setCardType]    = useState<CardType>(CARD_TYPES[0]);
  const [rarity,      setRarity]      = useState<Rarity>(RARITY[0]);
  const [stats,       setStats]       = useState<Stats>(initialStats);
  const [description, setDescription] = useState<string>("ここにカードの説明を入力してください。");
  const [cost,        setCost]        = useState<number>(3);
  const [frame,       setFrame]       = useState<CardFrame>("standard");
  const [imageUrl,    setImageUrl]    = useState<string | null>(null);
  const [activeTab,   setActiveTab]   = useState<TabId>("basic");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const setStat = (key: StatKey, value: number): void => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const totalPower = Math.round((stats.atk + stats.def + stats.spd + stats.mag) / 4);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "basic",  label: "基本情報" },
    { id: "stats",  label: "ステータス" },
    { id: "design", label: "デザイン" },
  ];

  return (
    <div style={styles.root}>
      <div style={styles.noiseBg} />

      {/* ヘッダー */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>✦ CARD FORGE ✦</span>
          <div style={styles.headerActions}>
            <button style={styles.btnSecondary}>下書き保存</button>
            <button style={{ ...styles.btnPrimary, background: cardType.color, color: "#0a0a0a" }}>
              完成・エクスポート
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* 左：エディタ */}
        <section style={styles.editorPanel}>
          {/* タブ */}
          <div style={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id
                    ? { ...styles.tabActive, borderColor: cardType.color, color: cardType.color }
                    : {}),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={styles.tabContent}>
            {/* 基本情報タブ */}
            {activeTab === "basic" && (
              <div>
                <FormGroup label="カード名">
                  <input
                    style={styles.input}
                    value={cardName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCardName(e.target.value)}
                    maxLength={24}
                  />
                </FormGroup>

                <FormGroup label="属性">
                  <div style={styles.typeGrid}>
                    {CARD_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCardType(t)}
                        style={{
                          ...styles.typeBtn,
                          borderColor: cardType.id === t.id ? t.color : "transparent",
                          background:  cardType.id === t.id ? `${t.color}22` : "#1e1e1e",
                          color: t.color,
                          boxShadow: cardType.id === t.id ? `0 0 12px ${t.glow}66` : "none",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </FormGroup>

                <FormGroup label="レアリティ">
                  <div style={styles.rarityRow}>
                    {RARITY.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRarity(r)}
                        style={{
                          ...styles.rarityBtn,
                          borderColor: rarity.id === r.id ? cardType.color : "#333",
                          color:       rarity.id === r.id ? cardType.color : "#888",
                          background:  rarity.id === r.id ? `${cardType.color}18` : "transparent",
                        }}
                      >
                        <span style={{ fontSize: 10 }}>{"★".repeat(r.stars)}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </FormGroup>

                <FormGroup label="コスト">
                  <div style={styles.costRow}>
                    {([1,2,3,4,5,6,7,8,9,10] as number[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCost(c)}
                        style={{
                          ...styles.costBtn,
                          background: cost === c ? cardType.color : "#1e1e1e",
                          color:      cost === c ? "#0a0a0a" : "#666",
                          fontWeight: cost === c ? 700 : 400,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </FormGroup>

                <FormGroup label="フレーバーテキスト">
                  <textarea
                    style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    maxLength={120}
                  />
                  <div style={styles.charCount}>{description.length}/120</div>
                </FormGroup>
              </div>
            )}

            {/* ステータスタブ */}
            {activeTab === "stats" && (
              <div>
                <div style={styles.powerBadge}>
                  <span style={styles.powerLabel}>総合力</span>
                  <span style={{ ...styles.powerValue, color: cardType.color }}>{totalPower}</span>
                </div>

                {(Object.entries(STAT_META) as Array<[StatKey, { label: string; icon: string }]>).map(
                  ([key, { label, icon }]) => (
                    <div key={key} style={styles.statRow}>
                      <div style={styles.statLabel}>
                        <span style={{ opacity: 0.7 }}>{icon}</span>
                        <span>{label}</span>
                      </div>
                      <div style={styles.sliderWrap}>
                        <div style={styles.sliderTrack}>
                          <div style={{
                            ...styles.sliderFill,
                            width: `${stats[key]}%`,
                            background: `linear-gradient(90deg, ${cardType.glow}, ${cardType.color})`,
                            boxShadow: `0 0 8px ${cardType.glow}88`,
                          }} />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={stats[key]}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setStat(key, Number(e.target.value))
                          }
                          style={styles.rangeInput}
                        />
                      </div>
                      <span style={{ ...styles.statValue, color: cardType.accent }}>{stats[key]}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* デザインタブ */}
            {activeTab === "design" && (
              <div>
                <FormGroup label="イラスト">
                  <div
                    style={styles.imageUploadZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageUrl
                      ? <img src={imageUrl} alt="uploaded" style={styles.previewThumb} />
                      : <div style={styles.uploadPlaceholder}>
                          <span style={{ fontSize: 32, opacity: 0.4 }}>🖼</span>
                          <span style={{ fontSize: 12, opacity: 0.5 }}>クリックして画像を選択</span>
                        </div>
                    }
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </div>
                </FormGroup>

                <FormGroup label="フレームスタイル">
                  <div style={styles.frameGrid}>
                    {CARD_FRAMES.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrame(f)}
                        style={{
                          ...styles.frameBtn,
                          borderColor: frame === f ? cardType.color : "#333",
                          color:       frame === f ? cardType.color : "#666",
                          background:  frame === f ? `${cardType.color}14` : "#181818",
                        }}
                      >
                        {FRAME_LABEL[f]}
                      </button>
                    ))}
                  </div>
                </FormGroup>
              </div>
            )}
          </div>
        </section>

        {/* 右：プレビュー */}
        <section style={styles.previewPanel}>
          <div style={styles.previewLabel}>プレビュー</div>
          <div style={styles.cardWrap}>
            <CardPreview
              name={cardName}
              type={cardType}
              rarity={rarity}
              stats={stats}
              description={description}
              cost={cost}
              frame={frame}
              imageUrl={imageUrl}
            />
          </div>

          {/* ミニステータスバー */}
          <div style={styles.miniStats}>
            {(Object.entries(stats) as Array<[StatKey, number]>).map(([k, v]) => (
              <div key={k} style={styles.miniStatRow}>
                <span style={styles.miniStatKey}>{k.toUpperCase()}</span>
                <div style={styles.miniBarBg}>
                  <div style={{ ...styles.miniBarFill, width: `${v}%`, background: cardType.color }} />
                </div>
                <span style={{ ...styles.miniStatVal, color: cardType.accent }}>{v}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Noto+Serif+JP:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; cursor: pointer; margin-top: -6px; }
        input[type=range]::-webkit-slider-runnable-track { background: transparent; height: 4px; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        textarea { font-family: inherit; }
      `}</style>
    </div>
  );
}

// ─── スタイル定義 ─────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e0e0e0",
    fontFamily: "'Cinzel', serif",
    position: "relative",
    overflow: "hidden",
  },
  noiseBg: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    borderBottom: "1px solid #1e1e1e",
    background: "rgba(10,10,10,0.9)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 16,
    letterSpacing: "0.3em",
    color: "#fff",
    fontWeight: 900,
  },
  headerActions: {
    display: "flex",
    gap: 10,
  },
  btnSecondary: {
    padding: "8px 18px",
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 4,
    color: "#888",
    cursor: "pointer",
    fontSize: 12,
    letterSpacing: "0.1em",
    fontFamily: "'Cinzel', serif",
    transition: "all 0.2s",
  },
  btnPrimary: {
    padding: "8px 18px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    letterSpacing: "0.1em",
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 32,
    position: "relative",
    zIndex: 1,
  },
  editorPanel: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 12,
    overflow: "hidden",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #1e1e1e",
  },
  tab: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#555",
    cursor: "pointer",
    fontSize: 11,
    letterSpacing: "0.15em",
    fontFamily: "'Cinzel', serif",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#fff",
  },
  tabContent: {
    padding: "24px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 200px)",
  },
  input: {
    width: "100%",
    background: "#181818",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "10px 12px",
    color: "#e0e0e0",
    fontSize: 13,
    fontFamily: "'Noto Serif JP', serif",
    outline: "none",
    transition: "border-color 0.2s",
  },
  typeGrid: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBtn: {
    padding: "8px 18px",
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    transition: "all 0.2s",
    letterSpacing: "0.1em",
  },
  rarityRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  rarityBtn: {
    padding: "7px 12px",
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "'Cinzel', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    transition: "all 0.2s",
    letterSpacing: "0.05em",
  },
  costRow: {
    display: "flex",
    gap: 6,
  },
  costBtn: {
    width: 36,
    height: 36,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Cinzel', serif",
    transition: "all 0.2s",
  },
  charCount: {
    textAlign: "right",
    fontSize: 10,
    color: "#444",
    marginTop: 4,
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  statLabel: {
    width: 90,
    fontSize: 11,
    color: "#777",
    display: "flex",
    gap: 6,
    alignItems: "center",
    letterSpacing: "0.05em",
  },
  sliderWrap: {
    flex: 1,
    position: "relative",
    height: 24,
    display: "flex",
    alignItems: "center",
  },
  sliderTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 4,
    background: "#1e1e1e",
    borderRadius: 2,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.1s",
  },
  rangeInput: {
    position: "absolute",
    left: 0,
    right: 0,
    opacity: 0.01,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  statValue: {
    width: 36,
    textAlign: "right",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  powerBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#181818",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: "20px",
    marginBottom: 28,
    textAlign: "center",
  },
  powerLabel: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#555",
    marginBottom: 8,
  },
  powerValue: {
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.02em",
  },
  imageUploadZone: {
    width: "100%",
    height: 160,
    background: "#181818",
    border: "1px dashed #2a2a2a",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  previewThumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  frameGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  frameBtn: {
    padding: "12px",
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "'Cinzel', serif",
    transition: "all 0.2s",
    letterSpacing: "0.05em",
  },
  previewPanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    position: "sticky",
    top: 90,
    height: "fit-content",
  },
  previewLabel: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#555",
    alignSelf: "flex-start",
  },
  cardWrap: {
    filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))",
    transition: "transform 0.3s",
  },
  miniStats: {
    width: "100%",
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 10,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  miniStatRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  miniStatKey: {
    width: 32,
    fontSize: 9,
    color: "#555",
    letterSpacing: "0.1em",
  },
  miniBarBg: {
    flex: 1,
    height: 3,
    background: "#1e1e1e",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s",
  },
  miniStatVal: {
    width: 28,
    textAlign: "right",
    fontSize: 12,
    fontWeight: 700,
  },
};
