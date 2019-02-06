import * as _CryptoJS from 'crypto-js';
import * as _Uuid from 'uuid/v4';

export const CryptoJS  = _CryptoJS,
  Uuid = _Uuid;

export const ZObject = {
  ...Object,
  _entries: (obj: any): IterableIterator<[string, any]> => Object.keys(obj)
    .map<[string, any]>(key => [key, obj[key]])[Symbol.iterator](),
  entries: (obj: any): [string, any][] => Object.keys(obj)
    .map<[string, any]>(key => [key, obj[key]]),
};
