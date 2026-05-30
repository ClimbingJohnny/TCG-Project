import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from 'bcrypt';
import type { arrayOutputType } from "zod/v3";
import { record } from "zod";

const connectionString = process.env.DATABASE_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function upsertByName(
  model: any, // モデル名
  columns: string[], // カラム名
  unique: string | string[] | { compositeKey: string; keys: string[] } | null = null, // ユニークキー
  records: ((string | string[] | number | BigInt | Boolean | object)[])[] // 挿入するレコードの中身
) {
  if (unique == null) {
    unique = columns[0]!;
  }

  // 複数レコードを一括処理し、すべての戻り値を配列で返す
  const results: any[] = [];
  
  for (const r of records) {
    if (columns.length !== r.length) {
      console.log("導入するカラム数と内容が合っていません");
      continue;
    }
    
    // columns と row から object を生成
    const data: Record<string, any> = {};
    columns.forEach((col, index) => {
      data[col] = r[index];
    });
    
    // where句を構築（単一キー、複合キー、複合キーフィールド対応）
    let whereClause: Record<string, any> = {};
    
    if (typeof unique === "object" && "compositeKey" in unique) {
      // Prismaの複合キーフィールド名を使う場合
      whereClause[unique.compositeKey] = {};
      
      unique.keys.forEach(key => {
        whereClause[unique.compositeKey][key] = data[key];
      });
    } else if (Array.isArray(unique)) {
      // 複合キーの場合（オブジェクト形式で指定）
      unique.forEach(key => {
        whereClause[key] = data[key];
      });
    } else {
      // 単一キーの場合
      whereClause[unique] = data[unique];
    }
    
    const result = await model.upsert({
      where: whereClause,
      update: data,
      create: data,
    });
    
    results.push(result);
  }
  
  return results;
}
async function main() {
  console.log("🌱 Seeding database...");

  // Hash passwords (synchronous version)

  // Clean up existing data (optional - remove if you want to preserve)
  // await prisma.history.deleteMany();
  // await prisma.deckCard.deleteMany();
  // await prisma.deck.deleteMany();
  // await prisma.cardRace.deleteMany();
  // await prisma.cardPack.deleteMany();
  // await prisma.card.deleteMany();
  // await prisma.pack.deleteMany();
  // await prisma.race.deleteMany();
  // await prisma.user.deleteMany();

  // Create sample users
  const [user1, user2, user3] = await upsertByName(
    prisma.user,
    ["name", "password", "isadmin"],
    "name",
    [
      ["test", bcrypt.hashSync("test",10), false],
      ["Testplayer",bcrypt.hashSync("testes",10),false],
      ["iamtestman",bcrypt.hashSync("testes",10),false]
    ]
  );
  console.log("✓ Users created:", { user1: user1.name, user2: user2.name, user3: user3.name });

  // Create sample races
  const [raceWarrior, raceDragon, raceMagician, raceUndead] = await upsertByName(
    prisma.race,
    ["name"],
    "name",
    [
      ["戦士"],
      ["ドラゴン"],
      ["マジシャン"],
      ["アンデッド"]
    ]
  );
  console.log("✓ Races created");
  // Create sample cards
  const [card1, card2, card3, card4] = await upsertByName(
    prisma.card,
    ["name", "cardtype", "power", "level", "effect", "flavorText", "regulation", "made_by"],
    "name",
    [
      ["Mighty Warrior", "Character", BigInt(3000), 5, { ability: "Double attack on first turn" }, "A legendary warrior with unmatched strength", 0, user1.id],
      ["Fireball Spell", "Spell", null, 3, {}, "Deal massive fire damage", 0, user1.id],
      ["Shield Trap", "Trap", null, 2, { block: "" }, "Protect yourself from incoming damage", 0, user2.id],
      ["Dark Ninja", "Character", BigInt(2500), 4, { stealth: "Evade first attack" }, "A shadow warrior in the night", 0, user1.id]
    ]
  );
  console.log("✓ Cards created");

  // Create card-race relationships
  await upsertByName(
    prisma.card_Race,
    ["card_Id", "race_Id"],
    { compositeKey: "card_Id_race_Id", keys: ["card_Id", "race_Id"] },
    [
      [card1.id, raceWarrior.id],
      [card1.id, raceDragon.id],
      [card3.id, raceUndead.id],
      [card4.id, raceDragon.id]
    ]
  );
  console.log("✓ Card-Race relationships created");

  // Create sample pack
  const [pack1] = await upsertByName(
    prisma.pack,
    ["name", "Closed", "made_by"],
    "name",
    [
      ["Starter Pack", false, user1.id]
    ]
  );
  console.log("✓ Pack created");

  // Add cards to pack
  await upsertByName(
    prisma.card_Pack,
    ["card_Id", "pack_Id"],
    { compositeKey: "card_Id_pack_Id", keys: ["card_Id", "pack_Id"] },
    [
      [card1.id, pack1.id],
      [card2.id, pack1.id]
    ]
  );
  console.log("✓ Card-Pack relationships created");

  // Create sample deck
  const [deck1] = await upsertByName(
    prisma.deck,
    ["name", "description", "userId"],
    { compositeKey: "userId_name", keys: ["userId", "name"] },
    [
      ["Warrior Deck", "A deck focused on strong warrior characters", user1.id]
    ]
  );
  console.log("✓ Deck created");

  // Add cards to deck
  await upsertByName(
    prisma.deck_Card,
    ["deck_Id", "card_Id", "count"],
    { compositeKey: "deck_Id_card_Id", keys: ["deck_Id", "card_Id"] },
    [
      [deck1.id, card1.id, 2],
      [deck1.id, card2.id, 1]
    ]
  );
  console.log("✓ Deck-Card relationships created");

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
