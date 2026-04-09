import type { InventoryCrate, UpgradeState } from '../types';
import { UPGRADE_DEFS, MAX_INVENTORY } from '../constants';
import { formatMoney } from '../utils';

interface Props {
  inventory: InventoryCrate[];
  upgrades: UpgradeState;
  onOpen: (id: string) => void;
  onSell: (id: string) => void;
}

export default function Inventory({ inventory, upgrades, onOpen, onSell }: Props) {
  const sellDef = UPGRADE_DEFS.find(u => u.id === 'sellBonus')!;
  const sellMult = sellDef.effect(upgrades.sellBonus);
  const baseSell = 8;
  const sellValue = Math.round(baseSell * sellMult);

  return (
    <div className="panel inventory-panel">
      <h2>📦 Inventory ({inventory.length}/{MAX_INVENTORY})</h2>
      {inventory.length === 0 && <div className="empty-msg">No crates ready. Wait for decryption!</div>}
      <div className="inventory-list">
        {inventory.map(crate => (
          <div key={crate.id} className="inventory-crate">
            <span className="crate-icon">📦</span>
            <span className="crate-label">Encrypted Crate</span>
            <div className="crate-actions">
              <button className="btn btn-open" onClick={() => onOpen(crate.id)}>Open</button>
              <button className="btn btn-sell" onClick={() => onSell(crate.id)}>
                Sell ({formatMoney(sellValue)})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
