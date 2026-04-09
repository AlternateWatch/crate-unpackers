import type { GameState } from './types';

const SAVE_KEY = 'crateUnpackersSave';

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (typeof parsed.money !== 'number') return null;
    if (!Array.isArray(parsed.decryptQueue)) return null;
    if (!Array.isArray(parsed.inventory)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function exportSave(state: GameState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crate-unpackers-save-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSave(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string) as GameState;
        if (typeof data.money !== 'number' || !Array.isArray(data.decryptQueue)) {
          reject(new Error('Invalid save file format'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Could not parse save file'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
