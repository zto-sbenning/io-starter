import { Action } from '@ngrx/store';
import { Uuid } from '../app/app.tools';

export abstract class Message<T = any> implements Action {
  abstract type: string;
  constructor(
    public payload: T = {} as any,
    public correlationId: string = Uuid()
  ) { }
}

export abstract class RequestMessage<T = any> extends Message<T> {
  startLoading = true;
}

export abstract class ResponseMessage<T = any> extends Message<T> {
  stopLoading = true;
}
