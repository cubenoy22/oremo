import Peer from "peerjs";

export class ChatPeer {

    private _isOpen: boolean = false;

    constructor(public conn: Peer.DataConnection) {
        conn.on('open', this.onOpen.bind(this));
        conn.on('data', this.onData.bind(this));
        conn.on('error', this.onError.bind(this));
        conn.on('close', this.onClose.bind(this));
    }

    get isOpen() {
        return this._isOpen;
    }

    private onOpen() {
        console.log('onOpen: ', this.conn.peer);
        this._isOpen = true;
        // this.messageDispatch({ type: 'add', value: `connected to: ${this.conn.peer}` });
    }

    private onData(data: String) {
        console.log('onData: ', this.conn.peer, data);
        // this.messageDispatch({ type: 'add', value: `${this.conn.peer} says: ${data}`});
    }

    private onError(error: any) {
        console.log('onError: ', this.conn.peer, error);

    }

    private onClose() {
        console.log('onClose: ', this.conn.peer);
        this._isOpen = false;
    }
}