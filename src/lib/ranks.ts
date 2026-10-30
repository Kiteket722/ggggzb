export type RankMeta = {
  name: string;
  color: string;
  gradient: string;
  reward: number;
};

export const RANK_THRESHOLDS = [
  0, 45, 135, 270, 450, 720, 1080, 1530, 2070,
  2700, 3600, 4680, 6120, 7740, 9720, 12150, 14850, 18000,
  22500, 27000, 32400, 38700, 46800, 58500,
];

export function computeRankIndex(xp: number): number {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= RANK_THRESHOLDS[i]) return i;
  }
  return 0;
}

export const RANK_META: RankMeta[] = [
  { name: "BRONZE I", color: "#cd7f32", gradient: "linear-gradient(90deg, #8b4513, #cd7f32)", reward: 0 },
  { name: "BRONZE II", color: "#cd7f32", gradient: "linear-gradient(90deg, #8b4513, #cd7f32)", reward: 10 },
  { name: "BRONZE III", color: "#cd7f32", gradient: "linear-gradient(90deg, #8b4513, #cd7f32)", reward: 50 },
  { name: "SILVER I", color: "#c0c0c0", gradient: "linear-gradient(90deg, #808080, #c0c0c0)", reward: 100 },
  { name: "SILVER II", color: "#c0c0c0", gradient: "linear-gradient(90deg, #808080, #c0c0c0)", reward: 150 },
  { name: "SILVER III", color: "#c0c0c0", gradient: "linear-gradient(90deg, #808080, #c0c0c0)", reward: 200 },
  { name: "GOLD I", color: "#ffd700", gradient: "linear-gradient(90deg, #b8860b, #ffd700)", reward: 250 },
  { name: "GOLD II", color: "#ffd700", gradient: "linear-gradient(90deg, #b8860b, #ffd700)", reward: 350 },
  { name: "GOLD III", color: "#ffd700", gradient: "linear-gradient(90deg, #b8860b, #ffd700)", reward: 450 },
  { name: "ELITEGOLD I", color: "#ffb800", gradient: "linear-gradient(90deg, #cc8800, #ffb800)", reward: 600 },
  { name: "ELITEGOLD II", color: "#ffb800", gradient: "linear-gradient(90deg, #cc8800, #ffb800)", reward: 750 },
  { name: "ELITEGOLD III", color: "#ffb800", gradient: "linear-gradient(90deg, #cc8800, #ffb800)", reward: 900 },
  { name: "DIAMOND I", color: "#b9f2ff", gradient: "linear-gradient(90deg, #0096b5, #b9f2ff)", reward: 1000 },
  { name: "DIAMOND II", color: "#b9f2ff", gradient: "linear-gradient(90deg, #0096b5, #b9f2ff)", reward: 1200 },
  { name: "DIAMOND III", color: "#b9f2ff", gradient: "linear-gradient(90deg, #0096b5, #b9f2ff)", reward: 1400 },
  { name: "PLATINUM I", color: "#e5e4e2", gradient: "linear-gradient(90deg, #5c9ca0, #e5e4e2)", reward: 1600 },
  { name: "PLATINUM II", color: "#e5e4e2", gradient: "linear-gradient(90deg, #5c9ca0, #e5e4e2)", reward: 1800 },
  { name: "PLATINUM III", color: "#e5e4e2", gradient: "linear-gradient(90deg, #5c9ca0, #e5e4e2)", reward: 2000 },
  { name: "TITAN I", color: "#ff5722", gradient: "linear-gradient(90deg, #bf360c, #ff5722)", reward: 2300 },
  { name: "TITAN II", color: "#ff5722", gradient: "linear-gradient(90deg, #bf360c, #ff5722)", reward: 2600 },
  { name: "TITAN III", color: "#ff5722", gradient: "linear-gradient(90deg, #bf360c, #ff5722)", reward: 3000 },
  { name: "MASTER", color: "#ff1744", gradient: "linear-gradient(90deg, #b71c1c, #ff1744)", reward: 3500 },
  { name: "ELITE", color: "#00e676", gradient: "linear-gradient(90deg, #00c853, #00e676)", reward: 4000 },
  { name: "ABSOLUTE", color: "#e91e63", gradient: "linear-gradient(90deg, #880e4f, #e91e63)", reward: 5000 },
];
