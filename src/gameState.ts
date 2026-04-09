import type { GameState, DecryptJob, InventoryCrate, UpgradeState } from './types';
import { STARTING_MONEY, BASE_DECRYPT_TIME, CRATE_COST, MAX_EVENT_LOG, MAX_INVENTORY, UPGRADE_DEFS } from './constants';
import { rollReward, getUpgradeCost, generateId } from './utils';

export function createInitialState(): GameState {
  return {
    money: STARTING_MONEY,
    decryptQueue: [],
    inventory: [],
    upgrades: { decryptSpeed: 0, luckBonus: 0, sellBonus: 0, queueSize: 0 },
    stats: { totalOpened: 0, totalSold: 0, moneyEarned: 0, bestDrop: null },
    eventLog: ['Welcome to Crate Unpackers! Add a crate to the decrypt queue to begin.'],
    lastSaveTime: Date.now(),
  };
}

export type GameAction =
  | { type: 'TICK'; now: number }
  | { type: 'ADD_CRATE' }
  | { type: 'OPEN_CRATE'; crateId: string }
  | { type: 'SELL_CRATE'; crateId: string }
  | { type: 'BUY_UPGRADE'; upgradeId: keyof UpgradeState }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'RESET' }
  | { type: 'MARK_SAVED' };

function addLog(log: string[], message: string): string[] {
  const next = [message, ...log];
  return next.slice(0, MAX_EVENT_LOG);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      const now = action.now;
      const newInventory: InventoryCrate[] = [...state.inventory];
      const remaining: DecryptJob[] = [];
      const newLog = [...state.eventLog];

      for (const job of state.decryptQueue) {
        if (now >= job.startTime + job.duration) {
          if (newInventory.length < MAX_INVENTORY) {
            newInventory.push({ id: generateId(), addedAt: now });
            newLog.unshift(`🔓 Crate decrypted! It's in your inventory.`);
            if (newLog.length > MAX_EVENT_LOG) newLog.pop();
          } else {
            remaining.push(job);
          }
        } else {
          remaining.push(job);
        }
      }
      return { ...state, decryptQueue: remaining, inventory: newInventory, eventLog: newLog };
    }

    case 'ADD_CRATE': {
      const speedDef = UPGRADE_DEFS.find(u => u.id === 'decryptSpeed')!;
      const queueDef = UPGRADE_DEFS.find(u => u.id === 'queueSize')!;
      const maxQueue = queueDef.effect(state.upgrades.queueSize);
      if (state.decryptQueue.length >= maxQueue) return state;
      if (state.money < CRATE_COST) return state;

      const speedMult = speedDef.effect(state.upgrades.decryptSpeed);
      const duration = Math.round(BASE_DECRYPT_TIME * speedMult);
      const job: DecryptJob = { id: generateId(), startTime: Date.now(), duration };

      return {
        ...state,
        money: state.money - CRATE_COST,
        decryptQueue: [...state.decryptQueue, job],
        eventLog: addLog(state.eventLog, `📦 Crate added to decrypt queue (${(duration/1000).toFixed(1)}s)`),
      };
    }

    case 'OPEN_CRATE': {
      const crate = state.inventory.find(c => c.id === action.crateId);
      if (!crate) return state;
      const reward = rollReward(
        UPGRADE_DEFS.find(u => u.id === 'luckBonus')!.effect(state.upgrades.luckBonus)
      );
      const newInventory = state.inventory.filter(c => c.id !== action.crateId);
      const newBestDrop =
        !state.stats.bestDrop || reward.value > state.stats.bestDrop.value
          ? reward
          : state.stats.bestDrop;
      return {
        ...state,
        inventory: newInventory,
        stats: {
          ...state.stats,
          totalOpened: state.stats.totalOpened + 1,
          bestDrop: newBestDrop,
        },
        eventLog: addLog(
          state.eventLog,
          `🎁 Opened crate → [${reward.rarity}] ${reward.name} (worth $${reward.value})`
        ),
      };
    }

    case 'SELL_CRATE': {
      const crate = state.inventory.find(c => c.id === action.crateId);
      if (!crate) return state;
      const sellDef = UPGRADE_DEFS.find(u => u.id === 'sellBonus')!;
      const sellMult = sellDef.effect(state.upgrades.sellBonus);
      const baseSell = 8;
      const sellValue = Math.round(baseSell * sellMult);
      return {
        ...state,
        money: state.money + sellValue,
        inventory: state.inventory.filter(c => c.id !== action.crateId),
        stats: {
          ...state.stats,
          totalSold: state.stats.totalSold + 1,
          moneyEarned: state.stats.moneyEarned + sellValue,
        },
        eventLog: addLog(state.eventLog, `💰 Sold crate for $${sellValue}`),
      };
    }

    case 'BUY_UPGRADE': {
      const def = UPGRADE_DEFS.find(u => u.id === action.upgradeId);
      if (!def) return state;
      const currentLevel = state.upgrades[action.upgradeId];
      if (currentLevel >= def.maxLevel) return state;
      const cost = getUpgradeCost(def.baseCost, def.costMultiplier, currentLevel);
      if (state.money < cost) return state;
      return {
        ...state,
        money: state.money - cost,
        upgrades: { ...state.upgrades, [action.upgradeId]: currentLevel + 1 },
        eventLog: addLog(state.eventLog, `⬆️ Upgraded: ${def.name} → Level ${currentLevel + 1}`),
      };
    }

    case 'LOAD_STATE':
      return action.state;

    case 'RESET':
      return { ...createInitialState(), lastSaveTime: Date.now() };

    case 'MARK_SAVED':
      return { ...state, lastSaveTime: Date.now() };

    default:
      return state;
  }
}
