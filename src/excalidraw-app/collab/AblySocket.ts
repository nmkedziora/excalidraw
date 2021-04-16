import Ably from "ably/callbacks";

export class AblySocket implements SocketIOClient.Socket {
  binaryType: "blob" | "arraybuffer" = "blob";
  connected: boolean = false;
  disconnected: boolean = false;
  id: string = "";
  io: SocketIOClient.Manager = undefined as any;
  nsp: string = "";

  _channel;

  constructor(roomId: any) {
    const ably = new Ably.Realtime("54wTiA.Qafx-g:l3r9axBFgoHRRiNK");
    const channel = ably.channels.get(roomId);
    this._channel = channel;

    channel.publish("init-room", "witam");
  }

  addEventListener(event: string, fn: Function): SocketIOClient.Emitter {
    throw Error("not implemeneted");
  }

  close(): SocketIOClient.Socket {
    return undefined as any;
  }

  compress(compress: boolean): SocketIOClient.Socket {
    throw Error("not implemeneted");
  }

  connect(): SocketIOClient.Socket {
    return undefined as any;
  }

  disconnect(): SocketIOClient.Socket {
    return undefined as any;
  }

  emit(event: string, ...args: any[]): SocketIOClient.Socket;
  emit(event: string, ...args: any[]): SocketIOClient.Emitter;
  emit(
    event: string,
    ...args: any[]
  ): SocketIOClient.Socket | SocketIOClient.Emitter {
    this._channel.publish(event, ...args);
    return undefined as any;
  }

  hasListeners(event: string): boolean {
    return false;
  }

  listeners(event: string): Function[] {
    return [];
  }

  off(event: string, fn?: Function): SocketIOClient.Emitter {
    this._channel.unsubscribe(event, fn as any);
    return undefined as any;
  }

  on(event: string, fn: Function): SocketIOClient.Emitter {
    this._channel.subscribe(event, fn as any);
    return undefined as any;
  }

  once(event: string, fn: Function): SocketIOClient.Emitter {
    throw Error("not implemeneted");
  }

  open(): SocketIOClient.Socket {
    throw Error("not implemeneted");
  }

  removeAllListeners(): SocketIOClient.Emitter {
    throw Error("not implemeneted");
  }

  removeEventListener(event: string, fn?: Function): SocketIOClient.Emitter {
    throw Error("not implemeneted");
  }

  removeListener(event: string, fn?: Function): SocketIOClient.Emitter {
    throw Error("not implemeneted");
  }

  send(...args: any[]): SocketIOClient.Socket {
    throw Error("not implemeneted");
  }
}
