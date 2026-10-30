import type { Rarity } from "./rarity";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/game`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TOKEN_KEY = "zombix.playerToken";
const UNEXPECTED_RESPONSE = "Сервер вернул неожиданный ответ.";

export type LootItem = {
  id: string;
  name: string;
  value: number;
  image_key: string | null;
  rarity: Rarity;
  level: number;
  found_at: string;
};

export type LevelInfo = {
  level: number;
  value: number;
  chance: number;
};

export type CaseItem = {
  name: string;
  rarity: Rarity;
  imageKey: string;
  chance: number;
  levels: LevelInfo[];
  priceRange: { min: number; max: number } | null;
};

export type CaseView = {
  key: string;
  name: string;
  price: number;
  items: CaseItem[];
};

export type DealKind = "withdraw" | "deposit";
export type DealStatus = "in_progress" | "completed" | "rejected";

export type DealTicket = {
  id: string;
  number: number;
  kind: DealKind;
  nickname: string;
  location: string;
  deal_time: string;
  amount: number;
  status: DealStatus;
  created_at: string;
};

export type RankUp = {
  fromIndex: number;
  toIndex: number;
  reward: number;
};

export type RankInfo = {
  name: string;
  index: number;
  xp: number;
  currentThreshold: number;
  nextThreshold: number;
  progressInRank: number;
  rankSpan: number;
  progressPct: number;
  isMaxRank: boolean;
};

export type GameState = {
  token: string;
  nickname: string | null;
  gold: number;
  searches: number;
  lastFreeCaseAt: string | null;
  serverTime: string;
  xp: number;
  rank: RankInfo;
  loot: LootItem[];
  tickets: DealTicket[];
  cases: CaseView[];
  freeCase: CaseView;
};

export type ContractInput = {
  itemId: string;
  extraItemIds: string[];
  goldAmount: number;
  targetValue: number;
};

export type ContractOutcome = { won: boolean; chance: number; target: number };

type DealDetails = {
  nickname: string;
  location: string;
  dealTime: string;
};

export type DealTicketInput =
  | (DealDetails & { kind: "deposit"; amount: number })
  | (DealDetails & { kind: "withdraw"; itemIds: string[] });

type ResponseBody = Record<string, unknown>;

function isGameState(data: unknown): data is GameState {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Partial<GameState>;
  return (
    typeof candidate.token === "string" &&
    typeof candidate.gold === "number" &&
    typeof candidate.searches === "number" &&
    Array.isArray(candidate.loot) &&
    Array.isArray(candidate.tickets) &&
    Array.isArray(candidate.cases) &&
    typeof candidate.freeCase === "object" && candidate.freeCase !== null &&
    typeof candidate.serverTime === "string" &&
    typeof candidate.xp === "number" &&
    typeof candidate.rank === "object" && candidate.rank !== null
  );
}

export class BannedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BannedError";
  }
}

async function callGame(action: string, payload: Record<string, unknown> = {}): Promise<ResponseBody> {
  const token = localStorage.getItem(TOKEN_KEY);

  let response: Response;
  try {
    response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        Apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, token, ...payload }),
    });
  } catch {
    throw new Error("Нет соединения с сервером. Проверьте интернет и попробуйте снова.");
  }

  const data = (await response.json().catch(() => null)) as ResponseBody | null;
  if (!response.ok) {
    if (data?.banned === true) throw new BannedError(typeof data.error === "string" ? data.error : "Вы заблокированы.");
    const message = typeof data?.error === "string" ? data.error : null;
    throw new Error(message ?? "Не удалось выполнить действие. Попробуйте еще раз.");
  }
  if (!data) throw new Error(UNEXPECTED_RESPONSE);
  return data;
}

function readState(data: ResponseBody): GameState {
  if (!isGameState(data)) throw new Error(UNEXPECTED_RESPONSE);
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function fetchState(): Promise<GameState> {
  return readState(await callGame("state"));
}

export async function setNickname(nickname: string): Promise<GameState> {
  return readState(await callGame("set-nickname", { nickname }));
}

export async function openCase(caseKey: string, count: number): Promise<{ state: GameState; finds: LootItem[]; rankUp?: RankUp }> {
  const data = await callGame("open-case", { caseKey, count });
  const finds = data.finds as LootItem[] | undefined;
  if (!Array.isArray(finds) || finds.length !== count) throw new Error(UNEXPECTED_RESPONSE);
  const rankUp = data.rankUp as RankUp | undefined;
  return { state: readState(data), finds, rankUp };
}

export async function openFreeCase(): Promise<{ state: GameState; finds: LootItem[]; rankUp?: RankUp }> {
  const data = await callGame("open-free-case");
  const finds = data.finds as LootItem[] | undefined;
  if (!Array.isArray(finds) || finds.length !== 1) throw new Error(UNEXPECTED_RESPONSE);
  const rankUp = data.rankUp as RankUp | undefined;
  return { state: readState(data), finds, rankUp };
}

export async function sellItem(itemId: string): Promise<GameState> {
  return readState(await callGame("sell", { itemId }));
}

export async function previewContract(input: ContractInput): Promise<{ chance: number }> {
  const data = await callGame("contract-preview", { ...input });
  if (typeof data.chance !== "number") throw new Error(UNEXPECTED_RESPONSE);
  return { chance: data.chance };
}

export async function runContract(input: ContractInput): Promise<{ state: GameState; outcome: ContractOutcome }> {
  const data = await callGame("contract", { ...input });
  const outcome = data.contract as ContractOutcome | undefined;
  if (!outcome) throw new Error(UNEXPECTED_RESPONSE);
  return { state: readState(data), outcome };
}

export async function createDealTicket(input: DealTicketInput): Promise<GameState> {
  return readState(await callGame("create-ticket", { ...input }));
}
