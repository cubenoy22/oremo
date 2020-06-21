import React, { useState, useEffect } from 'react';
import { OrémoEngine } from './OrémoEngine';

export function MyPeerId(props: {
  engine: OrémoEngine
}) {
  const { engine } = props;
  const [peerId, setPeerId] = useState<string | undefined>();

  useEffect(() => {
    engine.onConnected = () => {
      setPeerId(engine.peerId);
    };
  }, [engine, setPeerId]);

  return <>
  {
    peerId && (
      <div>My Peer ID: {peerId}</div>
    )
  }
  </>;
};