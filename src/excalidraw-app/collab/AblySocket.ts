import Ably from "ably/callbacks";
import throttle from "lodash/throttle";
import { Types } from "ably";
import { SCENE } from "../app_constants";

const mergeScenUpdate = (first: any, second: any) => {
  const newElements = second.payload.elements;
  for (let i = first.payload.elements.length - 1; i >= 0; i--) {
    if (!newElements.find((x: any) => x.id === first.payload.elements[i].id)) {
      newElements.unshift(first.payload.elements[i]);
    }
  }

  return {
    ...second,
    payload: { elements: newElements },
  };
};

const throttleAggregate = (f: any, wait = 0) => {
  let aggregated: any = [];
  const invoked = () => {
    f(aggregated);
    aggregated = [];
  };
  const throttledF = throttle(invoked, wait, { leading: false });
  return (...args: any) => {
    aggregated.push(args);
    throttledF();
  };
};

function BatchedChannel(channel: Types.RealtimeChannelCallbacks): any {
  const subscribers: any = {};

  const internal = ({ data: { aggregated } }: any) => {
    if (aggregated) {
      aggregated.forEach(([event, data]: any) => {
        subscribers[event] = subscribers[event] || [];
        subscribers[event].forEach((f: any) => {
          return f(data);
        });
      });
    }
  };
  channel.subscribe(`___BATCHED`, internal as any);

  const subscribe = (event: string, f: any) => {
    subscribers[event] = subscribers[event] || [];

    subscribers[event].push(f);
  };

  const publish = throttleAggregate((aggregated: any[]) => {
    const optimized = aggregated.reduce((all, next, index) => {
      if (index === 0) {
        all.push(next);
        return all;
      }

      const lastIndex = all.length - 1;

      if (
        next[1]?.type === SCENE.UPDATE &&
        all[lastIndex][1].type === SCENE.UPDATE
      ) {
        all[lastIndex][1] = mergeScenUpdate(all[lastIndex][1], next[1]);
      } else {
        all.push(next);
      }
      return all;
    }, []);

    const msg = { aggregated: optimized };
    channel.publish(`___BATCHED`, msg);
  }, 500);

  const unsubscribe = (event: string, f: any) => {
    subscribers[event] = subscribers[event] || [];
    const metaIndex = subscribers[event].indexOf(f);

    if (metaIndex > -1) {
      subscribers[event].splice(metaIndex, 1);
    }
  };

  return { subscribe, publish, unsubscribe };
}

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
    const channel = BatchedChannel(ably.channels.get(roomId));
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
