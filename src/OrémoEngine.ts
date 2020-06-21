import Peer, { MediaConnection } from 'peerjs';
import { OrémoCall } from './OrémoCall';

export type OnConnectedListener = (isConnected: boolean) => void;
export interface OnCallChangedListener {
  (calls: OrémoCall[], added: OrémoCall, removed: undefined): void;
  (calls: OrémoCall[], added: undefined, removed: OrémoCall): void;
}

export class OrémoEngine {

  private _peer: Peer;
  private _onConnected?: OnConnectedListener;
  private _onCallChanged?: OnCallChangedListener;
  private _peerId?: string;
  private _myStream?: MediaStream;
  private _calls: OrémoCall[] = [];

  constructor(host: string, path: string, port: number, key: string) {
    this._peer = new Peer({
      host: host,
      path: path,
      port: port,
      secure: true,
      key: key,
    });

    this._peer.on('open', (id: string) => {
      this._peerId = id;
      this._onConnected?.(this.isConnected);
    });

    this._peer.on('close', () => {
      this._peerId = undefined;
      this._onConnected?.(this.isConnected);
    });

    this._peer.on('call', (call: MediaConnection) => {
      call.answer(this.myStream);
      this.addNewCall(call);
    });
  }

  get isConnected(): boolean {
    return !!this._peerId;
  }

  get peerId(): string | undefined {
    return this._peerId;
  }

  get onConnected(): OnConnectedListener | undefined {
    return this._onConnected;
  }

  set onConnected(listener: OnConnectedListener | undefined) {
    this._onConnected = listener;
  }

  get onCallChanged(): OnCallChangedListener | undefined {
    return this._onCallChanged;
  }

  set onCallChanged(listener: OnCallChangedListener | undefined) {
    this._onCallChanged = listener;
  }

  get myStream(): MediaStream | undefined {
    return this._myStream;
  }

  set myStream(stream: MediaStream | undefined) {
    this._myStream = stream;
  }

  private addNewCall(call: MediaConnection) {
    const orémoCall = new OrémoCall(call); 
    this._calls.push(orémoCall);
    call.on('error', (e) => {
      console.error('handle call error in engine', e);
    });
    call.on('close', () => {
      const index = this._calls.indexOf(orémoCall);
      if (index >= 0) {
        this._calls.splice(index);
        this._onCallChanged?.(this._calls, undefined, orémoCall);
      }
    });
    this._onCallChanged?.(this._calls, orémoCall, undefined);
  }

  call(id: string, stream: MediaStream) {
    const call = this._peer.call(id, stream, {
        metadata: {}
    });
    this.addNewCall(call);
  }
}