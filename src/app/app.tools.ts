import * as _CryptoJS from 'crypto-js';
import * as _Uuid from 'uuid/v4';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { filter, first } from 'rxjs/operators';

export const CryptoJS  = _CryptoJS,
  Uuid = _Uuid;

export const ZObject = {
  ...Object,
  _entries: (obj: any): IterableIterator<[string, any]> => Object.keys(obj)
    .map<[string, any]>(key => [key, obj[key]])[Symbol.iterator](),
  entries: (obj: any): [string, any][] => Object.keys(obj)
    .map<[string, any]>(key => [key, obj[key]]),
};

export function correlated(types: string[], correlationId: string): MonoTypeOperatorFunction<Message> {
  const correlatedPredicate = function (message: Message) {
    return types.indexOf(message.type) !== -1 && message.correlationId === correlationId;
  };
  return (messages$: Observable<Message>) => messages$.pipe(
    filter(correlatedPredicate),
    first()
  );
}
