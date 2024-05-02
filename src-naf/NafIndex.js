import { NafLogger } from './NafLogger';
import { Schemas } from './Schemas';
// import * as NetworkEntities from './NetworkEntities';
// import * as NetworkConnection from './NetworkConnection';
import { AdapterFactory } from './adapters/AdapterFactory';

export { options } from './options';
export * as utils from './utils';

// naf.app = '';
// naf.room = '';
// naf.clientId = '';
export const log = new NafLogger();
export const schemas = new Schemas();
// naf.version = "0.12.2";

export const adapters = new AdapterFactory();
// var entities = new NetworkEntities();
// var connection = new NetworkConnection(entities);
// naf.connection = connection;
// naf.entities = entities;
//
// module.exports = window.NAF = naf;
