import React, { useState, useEffect } from 'react';
import { OrémoCall } from './OrémoCall';
import { OrémoEngine } from './OrémoEngine';
import { NewCall } from './NewCall';
import { MyPeerId } from './MyPeerId';
import { MyCamera } from './MyCamera';
import { StreamPreview } from './StreamPreview';

export const Session = (props: {
  engine: OrémoEngine
}) => {
  const { engine } = props;
  const [calls, setCalls] = useState<OrémoCall[]>([]);

  useEffect(() => {
    if (engine) {
      engine.onCallChanged = (calls: OrémoCall[]) => {
        setCalls([...calls]);
      };
    }
  }, [engine]);

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        <div>
          <MyPeerId engine={engine} />
          <MyCamera engine={engine} />
        </div>
        {
          calls.map(call => <StreamPreview key={call.stream?.id} engine={engine} call={call} />)
        }
        <NewCall engine={engine} />
      </div>)
    </>
  );
};