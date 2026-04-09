import type { Stats } from '../types';
import { formatMoney } from '../utils';
import { RARITY_CONFIG } from '../constants';

interface Props {
  money: number;
  stats: Stats;
}

export default function CurrencyDisplay({ money, stats }: Props) {
  return (
    <div className="panel currency-panel">
      <div className="money-display">
        <span className="money-label">Balance</span>
        <span className="money-value">{formatMoney(money)}</span>
      </div>
      <div className="stats-row">
        <span>📦 Opened: {stats.totalOpened}</span>
        <span>💰 Sold: {stats.totalSold}</span>
        <span>💵 Earned: {formatMoney(stats.moneyEarned)}</span>
        {stats.bestDrop && (
          <span>
            🏆 Best:&nbsp;
            <span
              className={`rarity-badge rarity-${stats.bestDrop.rarity.toLowerCase()}`}
            >
              {stats.bestDrop.rarity}
            </span>
            &nbsp;
            <span style={{ color: RARITY_CONFIG[stats.bestDrop.rarity].color }}>
              {stats.bestDrop.name}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
