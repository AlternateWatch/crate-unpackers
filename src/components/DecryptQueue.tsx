import { useState, useEffect } from 'react';
import type { DecryptJob, UpgradeState } from '../types';
import { CRATE_COST, UPGRADE_DEFS } from '../constants';
import { formatDuration } from '../utils';

interface Props {
  queue: DecryptJob[];
  money: number;
  upgrades: UpgradeState;
  onAddCrate: () => void;
}

function JobProgress({ job, now }: { job: DecryptJob; now: number }) {
  const elapsed = now - job.startTime;
  const progress = Math.min(1, elapsed / job.duration);
  const remaining = Math.max(0, job.duration - elapsed);
  return (
    <div className="decrypt-job">
      <div className="job-label">
        <span>🔐 Decrypting...</span>
        <span className="status-chip chip-decrypting">Active</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="job-time">{formatDuration(remaining)} remaining</div>
    </div>
  );
}

export default function DecryptQueue({ queue, money, upgrades, onAddCrate }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const queueDef = UPGRADE_DEFS.find(u => u.id === 'queueSize')!;
  const maxQueue = queueDef.effect(upgrades.queueSize);
  const isFull = queue.length >= maxQueue;
  const canAdd = !isFull && money >= CRATE_COST;

  return (
    <div className="panel decrypt-panel">
      <h2>🔒 Decrypt Queue ({queue.length}/{maxQueue})</h2>

      {(isFull || money < CRATE_COST) && (
        <div className="queue-status-row">
          {isFull && <span className="status-chip chip-full">Queue Full</span>}
          {!isFull && money < CRATE_COST && (
            <span className="status-chip chip-funds">Need ${CRATE_COST}</span>
          )}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={onAddCrate}
        disabled={!canAdd}
        title={money < CRATE_COST ? `Need $${CRATE_COST}` : isFull ? 'Queue full' : ''}
      >
        + Add Crate (${CRATE_COST})
      </button>
      <div className="queue-list">
        {queue.length === 0 && <div className="empty-msg">No active decrypts. Add a crate!</div>}
        {queue.map(job => <JobProgress key={job.id} job={job} now={now} />)}
      </div>
    </div>
  );
}
