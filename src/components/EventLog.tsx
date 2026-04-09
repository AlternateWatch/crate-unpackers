interface Props {
  log: string[];
}

export default function EventLog({ log }: Props) {
  return (
    <div className="panel event-log-panel">
      <h2>📋 Event Log</h2>
      <div className="event-log-list">
        {log.map((entry, i) => (
          <div key={i} className="log-entry">{entry}</div>
        ))}
      </div>
    </div>
  );
}
