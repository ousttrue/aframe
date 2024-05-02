import { NAF } from './NafIndex';

export class NafInterface {
  notImplemented(name) {
    NAF.log.error('Interface method not implemented:', name);
  }
}
