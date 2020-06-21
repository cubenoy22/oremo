import Peer from "peerjs";

export type OnStreamAvailableListener = () => void;

export class OrémoCall {

  private _stream: MediaStream | undefined;
  private _onStreamAvailableListener: OnStreamAvailableListener | undefined;

  get stream(): MediaStream | undefined {
    return this._stream;
  }

  get onStreamAvailableListener(): OnStreamAvailableListener | undefined {
    return this._onStreamAvailableListener;
  }

  set onStreamAvailableListener(listener: OnStreamAvailableListener | undefined) {
    this._onStreamAvailableListener = listener;
  }

  constructor(private call: Peer.MediaConnection) {
    call.on('stream', (remoteStream) => {
      this._stream = remoteStream;
      this._onStreamAvailableListener?.();
    });
    call.on('close', () => {
      this._stream = undefined;
      this._onStreamAvailableListener?.();
    });
  }
}