export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface CrateReward {
  rarity: Rarity;
  name: string;
  value: number;
}

export interface DecryptJob {
  id: string;
  startTime: number;   // ms timestamp
  duration: number;    // ms
}

export interface InventoryCrate {
  id: string;
  addedAt: number;     // ms timestamp
}

export interface UpgradeState {
  decryptSpeed: number;   // level
  luckBonus: number;      // level
  sellBonus: number;      // level
  queueSize: number;      // level
}

export interface Stats {
  totalOpened: number;
  totalSold: number;
  moneyEarned: number;
  bestDrop: CrateReward | null;
}

export interface GameState {
  money: number;
  decryptQueue: DecryptJob[];
  inventory: InventoryCrate[];
  upgrades: UpgradeState;
  stats: Stats;
  eventLog: string[];
  lastSaveTime: number;
}
