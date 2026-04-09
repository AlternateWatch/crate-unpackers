import type { UpgradeState } from '../types';
import { UPGRADE_DEFS } from '../constants';
import { getUpgradeCost, formatMoney } from '../utils';

interface Props {
  upgrades: UpgradeState;
  money: number;
  onBuy: (id: keyof UpgradeState) => void;
}

export default function Upgrades({ upgrades, money, onBuy }: Props) {
  return (
    <div className="panel upgrades-panel">
      <h2>⬆️ Upgrades</h2>
      <div className="upgrade-grid">
        {UPGRADE_DEFS.map(def => {
          const level = upgrades[def.id];
          const maxed = level >= def.maxLevel;
          const cost = maxed ? 0 : getUpgradeCost(def.baseCost, def.costMultiplier, level);
          const canAfford = !maxed && money >= cost;
          const nextLevel = level + 1;
          const nextEffectValue = maxed ? 0 : Math.round((def.effect(nextLevel) - def.effect(level)) * 100);
          return (
            <div key={def.id} className={`upgrade-card ${maxed ? 'maxed' : ''} ${canAfford ? 'affordable' : ''}`}>
              <div className="upgrade-header">
                <span className="upgrade-name">{def.name}</span>
                <span className="upgrade-level">Lv {level}/{def.maxLevel}</span>
              </div>
              <div className="upgrade-desc">{def.description(level, nextEffectValue)}</div>
              <button
                className="btn btn-upgrade"
                onClick={() => onBuy(def.id)}
                disabled={!canAfford}
              >
                {maxed ? 'MAX' : `${formatMoney(cost)}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
