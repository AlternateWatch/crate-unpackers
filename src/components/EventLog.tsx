interface Props {
  log: string[];
}

function getLogClass(entry: string): string {
  if (entry.includes('[Legendary]')) return 'log-legendary';
  if (entry.includes('[Epic]'))      return 'log-epic';
  if (entry.includes('[Rare]'))      return 'log-rare';
  if (entry.includes('[Uncommon]'))  return 'log-uncommon';
  if (entry.startsWith('🔓'))        return 'log-decrypt';
  if (entry.startsWith('💰'))        return 'log-sell';
  if (entry.startsWith('⬆️'))        return 'log-upgrade';
  return '';
}

export default function EventLog({ log }: Props) {
  return (
    <div className="panel event-log-panel">
      <h2>📋 Event Log</h2>
      <div className="event-log-list">
        {log.map((entry, i) => (
          <div key={i} className={`log-entry ${getLogClass(entry)}`}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
