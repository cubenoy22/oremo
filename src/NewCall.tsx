import React, { useCallback, useState } from 'react';
import { OrémoEngine } from './OrémoEngine';

export function NewCall(props: {
  engine: OrémoEngine
}) {
  const { engine } = props;
  const [peerId, setPeerId] = useState<string>('');
  
  const onPeerIdChange = useCallback((e: React.ChangeEvent) => {
    setPeerId((e.target as HTMLInputElement).value);
  }, []);

  const call = useCallback(() => {
    engine.call(peerId, engine.myStream!);
  }, [peerId, engine]);

  return (
    <div>
      <input
        type='text'
        placeholder='PeerID to Connect'
        value={peerId}
        onChange={onPeerIdChange}
      />
      <button disabled={!peerId} onClick={call}>Call</button>
    </div>
  );
};