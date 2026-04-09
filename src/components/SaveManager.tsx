import { useRef } from 'react';

interface Props {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export default function SaveManager({ onExport, onImport, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="save-manager">
      <button className="btn btn-save" onClick={onExport}>Export Save</button>
      <button className="btn btn-save" onClick={() => fileRef.current?.click()}>Import Save</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = '';
        }}
      />
      <button className="btn btn-reset" onClick={onReset}>Reset</button>
    </div>
  );
}
