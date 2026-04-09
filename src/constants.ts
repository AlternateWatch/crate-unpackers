import type { Rarity } from './types';

export const RARITY_CONFIG: Record<Rarity, { color: string; baseValue: number; weight: number }> = {
  Common:    { color: '#aaa',    baseValue: 10,   weight: 500 },
  Uncommon:  { color: '#4caf50', baseValue: 50,   weight: 300 },
  Rare:      { color: '#2196f3', baseValue: 200,  weight: 150 },
  Epic:      { color: '#9c27b0', baseValue: 800,  weight: 45  },
  Legendary: { color: '#ff9800', baseValue: 3000, weight: 5   },
};

export const RARITY_NAMES: Record<Rarity, string[]> = {
  Common:    ['Rusty Bolt', 'Old Wire', 'Scrap Metal', 'Worn Chip'],
  Uncommon:  ['Circuit Board', 'Copper Coil', 'Data Shard', 'Power Cell'],
  Rare:      ['Quantum Lens', 'Neural Matrix', 'Encrypted Drive', 'Phase Crystal'],
  Epic:      ['Dark Matter Core', 'Void Chip', 'Singularity Cell', 'Plasma Arc'],
  Legendary: ['Omnishard', 'Nexus Core', 'The Keystone', 'Origin Fragment'],
};

export const BASE_DECRYPT_TIME = 10_000; // 10 seconds

export const CRATE_COST = 15;

export const STARTING_MONEY = 50;

export interface UpgradeDef {
  id: keyof import('./types').UpgradeState;
  name: string;
  description: (level: number, nextValue: number) => string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  effect: (level: number) => number;
}

export const UPGRADE_DEFS: UpgradeDef[] = [
  {
    id: 'decryptSpeed',
    name: 'Decryption Tech',
    description: (level, nextValue) => `Reduces decrypt time by ${nextValue}% (currently: ${level * 10}%)`,
    baseCost: 50,
    costMultiplier: 1.8,
    maxLevel: 9,
    effect: (level) => Math.max(0.1, 1 - level * 0.1),
  },
  {
    id: 'luckBonus',
    name: 'Forensic Analysis',
    description: (level, nextValue) => `Increases rare drop chance by ${nextValue} weight (currently: +${level * 10})`,
    baseCost: 75,
    costMultiplier: 2.0,
    maxLevel: 10,
    effect: (level) => level * 10,
  },
  {
    id: 'sellBonus',
    name: 'Black Market Access',
    description: (level, nextValue) => `Increases sell value by ${nextValue}% (currently: +${level * 15}%)`,
    baseCost: 60,
    costMultiplier: 1.9,
    maxLevel: 10,
    effect: (level) => 1 + level * 0.15,
  },
  {
    id: 'queueSize',
    name: 'Logistics Upgrade',
    description: (level, nextValue) => `Adds ${nextValue} decrypt slot (currently: ${3 + level} slots)`,
    baseCost: 100,
    costMultiplier: 2.5,
    maxLevel: 7,
    effect: (level) => 3 + level,
  },
];

export const AUTOSAVE_INTERVAL = 30_000;
export const MAX_EVENT_LOG = 50;
export const MAX_INVENTORY = 20;
export const MAX_UNBOXED_ITEMS = 50;
export const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
