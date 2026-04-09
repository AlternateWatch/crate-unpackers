import type { UnboxedItem, UpgradeState } from '../types';
import { UPGRADE_DEFS, MAX_UNBOXED_ITEMS } from '../constants';
import { formatMoney } from '../utils';

interface Props {
  items: UnboxedItem[];
  upgrades: UpgradeState;
  onSell: (id: string) => void;
}

export default function UnboxedInventory({ items, upgrades, onSell }: Props) {
  const sellDef = UPGRADE_DEFS.find(u => u.id === 'sellBonus')!;
  const sellMult = sellDef.effect(upgrades.sellBonus);

  return (
    <div className="panel unboxed-panel">
      <h2>🎁 Unboxed Items ({items.length}/{MAX_UNBOXED_ITEMS})</h2>
      {items.length === 0 && (
        <div className="empty-msg">No items yet. Open a crate to unbox something!</div>
      )}
      <div className="unboxed-list">
        {items.map(item => {
          const sellValue = Math.round(item.value * sellMult);
          return (
            <div key={item.id} className="unboxed-item">
              <span className={`rarity-badge rarity-${item.rarity.toLowerCase()}`}>
                {item.rarity}
              </span>
              <span className="unboxed-name">{item.name}</span>
              <span className="unboxed-value">{formatMoney(item.value)}</span>
              <button
                className="btn btn-sell"
                onClick={() => onSell(item.id)}
              >
                Sell ({formatMoney(sellValue)})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
