import React, { useEffect, useRef } from 'react';
import { OrémoEngine } from './OrémoEngine';
import { OrémoCall } from './OrémoCall';

export function StreamPreview(props: {
  engine: OrémoEngine,
  call: OrémoCall,
}) {
  const { call } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = call.stream ?? null;
    }
    call.onStreamAvailableListener = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = call.stream ?? null;
      }
    };
  }, []);

  return (
    <div>
      <video 
        ref={videoRef}
        onLoadedMetadata={e => { (e.target as HTMLVideoElement).play(); }}
        playsInline
      />
    </div>
  );
};