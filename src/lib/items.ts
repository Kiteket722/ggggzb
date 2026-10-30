export const ITEM_IMAGES: Record<string, string> = {
  berries: "/rewards/inventory/IMG_5178.webp",
  "farm-berry": "/rewards/inventory/IMG_5178.webp",
  rock: "/rewards/inventory/IMG_5176.jpeg",
  pickaxe: "/rewards/inventory/IMG_5175.jpeg",
  medkit: "/rewards/inventory/IMG_5177.webp",
  "leather-helmet": "/rewards/inventory/IMG_5212.jpeg",
  "gold-helmet": "/rewards/inventory/IMG_5213.jpeg",
  bat: "/rewards/inventory/IMG_5211.jpeg",
  glock: "/rewards/inventory/IMG_5215.jpeg",
  ak47: "/rewards/inventory/IMG_5214.jpeg",
  rifle: "/rewards/inventory/IMG_5208.jpeg",
  pistol: "/rewards/inventory/IMG_5209.jpeg",
  pumpkin: "/rewards/inventory/pumpkin.png",
  badge: "/rewards/inventory/IMG_5210.jpeg",
  rpg: "/rewards/inventory/IMG_5248.jpeg",
  cosmo: "/rewards/inventory/IMG_5247.jpeg",
  pp: "/rewards/inventory/IMG_5246.jpeg",
  minigun: "/rewards/inventory/IMG_5245.jpeg",
  freeze: "/rewards/inventory/IMG_5245.jpeg",
  boots: "/rewards/inventory/IMG_5245.jpeg",
  acid: "/rewards/inventory/IMG_5245.jpeg",
  "pumpkin-unique": "/rewards/inventory/IMG_5244.jpeg",
  emotion: "/rewards/inventory/IMG_5244.jpeg",
};

export const CASE_COVER = "/rewards/inventory/IMG_5210.jpeg";

export const GOLD_ICON = "/rewards/inventory/IMG_5174.jpeg";

export const TARGET_TIERS = [100, 200, 350, 500, 800, 1000, 2000, 3000];

export const MIN_WITHDRAW = 25;

export function formatChance(chance: number) {
  return `${Number.isInteger(chance) ? chance : chance.toFixed(1)}%`;
}
