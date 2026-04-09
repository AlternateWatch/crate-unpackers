import type { GameState, DecryptJob, InventoryCrate } from './types';
import { MAX_INVENTORY, OFFLINE_CAP_MS } from './constants';
import { generateId } from './utils';

export function applyOfflineProgress(state: GameState, now: number): { state: GameState; offlineSeconds: number } {
  const elapsed = Math.min(now - state.lastSaveTime, OFFLINE_CAP_MS);
  if (elapsed <= 0) return { state, offlineSeconds: 0 };

  const simulatedNow = state.lastSaveTime + elapsed;
  const newInventory: InventoryCrate[] = [...state.inventory];
  const remaining: DecryptJob[] = [];
  let completedCount = 0;
  const newLog = [...state.eventLog];

  for (const job of state.decryptQueue) {
    if (simulatedNow >= job.startTime + job.duration && newInventory.length < MAX_INVENTORY) {
      newInventory.push({ id: generateId(), addedAt: simulatedNow });
      completedCount++;
    } else {
      remaining.push(job);
    }
  }

  if (completedCount > 0) {
    newLog.unshift(`⏰ Offline: ${completedCount} crate(s) finished decrypting while you were away.`);
    if (newLog.length > 50) newLog.pop();
  }

  return {
    state: { ...state, decryptQueue: remaining, inventory: newInventory, eventLog: newLog, lastSaveTime: now },
    offlineSeconds: Math.round(elapsed / 1000),
  };
}
