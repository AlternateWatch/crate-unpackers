import { useReducer, useEffect, useRef, useCallback } from 'react';
import { gameReducer, createInitialState } from './gameState';
import { saveGame, loadGame, exportSave, importSave } from './storage';
import { applyOfflineProgress } from './offlineProgress';
import { AUTOSAVE_INTERVAL } from './constants';
import CurrencyDisplay from './components/CurrencyDisplay';
import DecryptQueue from './components/DecryptQueue';
import Inventory from './components/Inventory';
import Upgrades from './components/Upgrades';
import EventLog from './components/EventLog';
import SaveManager from './components/SaveManager';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    const saved = loadGame();
    if (saved) {
      const { state: progressed } = applyOfflineProgress(saved, Date.now());
      return progressed;
    }
    return createInitialState();
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now() });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(stateRef.current);
      dispatch({ type: 'MARK_SAVED' });
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => saveGame(stateRef.current);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const handleExport = useCallback(() => exportSave(state), [state]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const loaded = await importSave(file);
      const { state: progressed } = applyOfflineProgress(loaded, Date.now());
      dispatch({ type: 'LOAD_STATE', state: progressed });
    } catch (e) {
      alert(`Import failed: ${(e as Error).message}`);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      dispatch({ type: 'RESET' });
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>�� Crate Unpackers</h1>
        <SaveManager onExport={handleExport} onImport={handleImport} onReset={handleReset} />
      </header>
      <main className="app-main">
        <CurrencyDisplay money={state.money} stats={state.stats} />
        <div className="game-panels">
          <DecryptQueue
            queue={state.decryptQueue}
            money={state.money}
            upgrades={state.upgrades}
            onAddCrate={() => dispatch({ type: 'ADD_CRATE' })}
          />
          <Inventory
            inventory={state.inventory}
            upgrades={state.upgrades}
            onOpen={(id) => dispatch({ type: 'OPEN_CRATE', crateId: id })}
            onSell={(id) => dispatch({ type: 'SELL_CRATE', crateId: id })}
          />
        </div>
        <Upgrades
          upgrades={state.upgrades}
          money={state.money}
          onBuy={(id) => dispatch({ type: 'BUY_UPGRADE', upgradeId: id })}
        />
        <EventLog log={state.eventLog} />
      </main>
    </div>
  );
}
