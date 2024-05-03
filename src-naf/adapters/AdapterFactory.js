import { WsEasyRtcAdapter } from './WsEasyRtcAdapter';
import { EasyRtcAdapter } from './EasyRtcAdapter';
import { WebrtcAdapter } from './naf-webrtc-adapter';
import { SocketioAdapter } from './naf-socketio-adapter';

export class AdapterFactory {
  constructor() {
    this.adapters = {
      'wseasyrtc': WsEasyRtcAdapter,
      'easyrtc': EasyRtcAdapter,
      'socketio': SocketioAdapter,
      'webrtc': WebrtcAdapter
    };

    this.IS_CONNECTED = AdapterFactory.IS_CONNECTED;
    this.CONNECTING = AdapterFactory.CONNECTING;
    this.NOT_CONNECTED = AdapterFactory.NOT_CONNECTED;
  }

  register(adapterName, AdapterClass) {
    this.adapters[adapterName] = AdapterClass;
  }

  make(adapterName) {
    console.log(`AdapterFactory.make(${adapterName})`);
    var name = adapterName.toLowerCase();
    if (this.adapters[name]) {
      const AdapterClass = this.adapters[name];
      return new AdapterClass();
    } else {
      throw new Error(
        'Adapter: ' +
        adapterName +
        ' not registered. Please use NAF.adapters.register() to register this adapter.'
      );
    }
  }
}

AdapterFactory.IS_CONNECTED = 'IS_CONNECTED';
AdapterFactory.CONNECTING = 'CONNECTING';
AdapterFactory.NOT_CONNECTED = 'NOT_CONNECTED';