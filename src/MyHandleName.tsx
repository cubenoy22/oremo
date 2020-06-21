import React, { useCallback } from 'react';
import { OrémoEngine } from './OrémoEngine';

export function MyHandleName(props: {
  engine: OrémoEngine
}) {
  // const { engine } = props;
  const onKeyPress = useCallback((event: React.KeyboardEvent) => {
    
  }, []);
  
  return <>
  {
    <input
      type='text'
      placeholder='username'
      // value={handleName}
      onKeyPress={onKeyPress}
    />
  }
  </>;
};