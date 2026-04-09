import type { Rarity, CrateReward } from './types';
import { RARITY_CONFIG, RARITY_NAMES } from './constants';

export function weightedRandomRarity(luckBonus: number): Rarity {
  const rarities: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const weights = rarities.map(r => {
    let w = RARITY_CONFIG[r].weight;
    if (r === 'Rare' || r === 'Epic' || r === 'Legendary') {
      w += luckBonus;
    }
    return Math.max(0, w);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < rarities.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return rarities[i];
  }
  return 'Common';
}

export function rollReward(luckBonus: number): CrateReward {
  const rarity = weightedRandomRarity(luckBonus);
  const names = RARITY_NAMES[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  const baseValue = RARITY_CONFIG[rarity].baseValue;
  const variance = 0.8 + Math.random() * 0.4;
  const value = Math.round(baseValue * variance);
  return { rarity, name, value };
}

export function getUpgradeCost(baseCost: number, costMultiplier: number, currentLevel: number): number {
  return Math.round(baseCost * Math.pow(costMultiplier, currentLevel));
}

export function formatMoney(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

export function formatDuration(ms: number): string {
  if (ms >= 60_000) return `${(ms / 60_000).toFixed(1)}m`;
  return `${(ms / 1_000).toFixed(1)}s`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
