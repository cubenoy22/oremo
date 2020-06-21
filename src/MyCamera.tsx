import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OrémoEngine } from './OrémoEngine';

const updateStream = (async (
  getAudioInputDevices: () => MediaDeviceInfo[],
  getVideoInputDevices: () => MediaDeviceInfo[],
  videoDeviceIndex: number,
  audioDeviceIndex: number,
  setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>,
  usesCamera: boolean,
  usesMicrophone: boolean,
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  try {
    const { deviceId: audioDeviceId, groupId: audioGroupId } = getAudioInputDevices()[audioDeviceIndex] ?? {};
    const { deviceId: videoDeviceId, groupId: videoGroupId } = getVideoInputDevices()[videoDeviceIndex] ?? {};
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioDeviceId,
        groupId: audioGroupId,
      },
      video: {
        facingMode: 'user',
        deviceId: videoDeviceId,
        groupId: videoGroupId,
        width: 320,
        height: 240
      } as MediaTrackConstraints
    });
    setStream(stream);
    stream.getVideoTracks().forEach(t => { t.enabled = usesCamera; });
    stream.getAudioTracks().forEach(t => { t.enabled = usesMicrophone; });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (e) {
    console.error(e);
    setStream(undefined);
  }
});

const updateDevices = async (
  setIsDeviceSelectable: React.Dispatch<React.SetStateAction<boolean>>,
  setDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>,
) => {
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (devices.filter(d => d.label.length > 0).length > 0) {
      setIsDeviceSelectable(true);
    }
    setDevices(devices);
  }
};

export const MyCamera = (props: {
  engine: OrémoEngine
}) => {
  const { engine } = props;
  const [isDeviceSelectable, setIsDeviceSelectable] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [usesCamera, setUsesCamera] = useState(false);
  const [usesMicrophone, setUsesMicrophone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [videoDeviceIndex, setVideoDeviceIndex] = useState(0);
  const [audioDeviceIndex, setAudioDeviceIndex] = useState(0);

  const getVideoInputDevices = useCallback(
    () => devices.filter(deviceInfo => deviceInfo.kind === 'videoinput'),
    [devices]
  );
  const getAudioInputDevices = useCallback(
    () => devices.filter(deviceInfo => deviceInfo.kind === 'audioinput'),
    [devices]
  );

  // 初期化
  useEffect(() => {
    videoRef.current!.volume = 0; // 自分の声はプレビューしない
    updateDevices(setIsDeviceSelectable, setDevices);
  }, [isDeviceSelectable]);

  useEffect(() => {
    updateStream(
      getAudioInputDevices,
      getVideoInputDevices,
      videoDeviceIndex,
      audioDeviceIndex,
      setStream,
      usesCamera,
      usesMicrophone,
      videoRef
    );
  },
    // eslint-disable-next-line
    [
      getAudioInputDevices,
      getVideoInputDevices,
      videoDeviceIndex,
      audioDeviceIndex,
      setStream,
      // usesCamera,
      // usesMicrophone,
      videoRef
    ]);

  useEffect(() => {
    engine.myStream = stream;
  }, [engine, stream]);

  useEffect(() => {
    stream?.getVideoTracks().forEach(t => { t.enabled = usesCamera; });
  }, [stream, usesCamera]);

  useEffect(() => {
    stream?.getAudioTracks().forEach(t => { t.enabled = usesMicrophone; });
  }, [stream, usesMicrophone]);

  return (
    <div>
      <div>
        <label htmlFor='cameraCheck'>Camera: </label>
        <input
          id='cameraCheck'
          type='checkbox'
          checked={usesCamera}
          onChange={e => { setUsesCamera(e.target.checked); }}
        />
        {
          isDeviceSelectable && (
            <select onChange={e => { setVideoDeviceIndex((e.target as HTMLSelectElement).selectedIndex); }}>
              {
                getVideoInputDevices().map((deviceInfo) =>
                  (<option key={deviceInfo.deviceId}>{deviceInfo.label}</option>)
                )
              }
            </select>
          )
        }
        <br />
        <label htmlFor='microphoneCheck'>Microphone: </label>
        <input
          id='microphoneCheck'
          type='checkbox'
          checked={usesMicrophone}
          onChange={e => { setUsesMicrophone(e.target.checked); }}
        />
        {
          isDeviceSelectable && (
            <select onChange={e => { setAudioDeviceIndex((e.target as HTMLSelectElement).selectedIndex); }}>
              {
                getAudioInputDevices().map((deviceInfo) =>
                  (<option key={deviceInfo.deviceId}>{deviceInfo.label}</option>)
                )
              }
            </select>
          )
        }
      </div>
      <video
        ref={videoRef}
        onLoadedMetadata={e => { (e.target as HTMLVideoElement).play(); }}
        playsInline
      />
    </div>
  );
};