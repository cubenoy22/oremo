import React, { useState, useCallback } from 'react';
import { OrémoEngine } from './OrémoEngine';
import { Session } from './Session';

function App() {
  const [engine, setEngine] = useState<OrémoEngine | undefined>();
  const [server, setServer] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [port, setPort] = useState<string>('');

  const createSession = useCallback(() => {
    setEngine(new OrémoEngine(server, path, Number(port)));
  }, [server, path, port]);

  return (
    <>
      { engine && 
        <Session engine={engine} />
      }
      {
        !engine && (
          <div>
            <h1>Welcome to Orémo</h1>
            <input type='text' placeholder='server' value={server} onChange={ e => { setServer(e.target.value); } } /><br />
            <input type='text' placeholder='path' value={path} onChange={ e => { setPath(e.target.value); } } /><br />
            <input type='text' placeholder='port' value={port} onChange={ e => { setPort(e.target.value); } } /><br />
            <button disabled={ !server || !path || Number.isFinite(port) } onClick={ createSession }>Go</button>
          </div>
        )
      }
    </>
  );
}

export default App;
