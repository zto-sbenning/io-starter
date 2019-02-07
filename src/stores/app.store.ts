

import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, map, filter, skip, distinctUntilChanged, switchMap, first, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Message, RequestMessage, ResponseMessage } from '../models/message';
import { LoadingController, AlertController, Loading, Alert, Platform } from 'ionic-angular';
import { LoadRequestStorage, StorageActionType, LoadResponseStorage } from './storage.store';
import { ChangeRootNav } from './nav.store';
import { correlated, Uuid } from '../app/app.tools';
import { UserCredentials, AutoSignInRequestUser, UserActionType, AutoSignInResponseUser } from './user.store';



export interface AppState {
  ready: boolean;
  loadingCountRef: number;
  loading: boolean;
  error: Error;
}

export const initialAppState: AppState = {
  ready: false,
  loadingCountRef: 0,
  loading: false,
  error: null,
};

export const appStateSelector = 'app';
export const selectAppState = (states: any) => states[appStateSelector] as AppState;
export const selectAppReady = createSelector(selectAppState, (state: AppState) => state.ready);
export const selectAppLoadingCountRef = createSelector(selectAppState, (state: AppState) => state.loadingCountRef);
export const selectAppLoading = createSelector(selectAppState, (state: AppState) => state.loading);
export const selectAppError = createSelector(selectAppState, (state: AppState) => state.error);


export enum AppActionType {
  setReady = '[App] Set Ready',
  setLoading = '[App] Set Loading',
  setError = '[App] Set Error',
  loadingStart = '[App] Loading Start',
  loadingStop = '[App] Loading Stop',
  initializeRequest = '[App] Initialize Request',
  initializeResponse = '[App] Initialize Response',
}

export class SetReadyApp extends Message<{ ready: boolean }> {
  type = AppActionType.setReady;
}
export class SetLoadingApp extends Message<{ loading: boolean }> {
  type = AppActionType.setLoading;
}
export class SetErrorApp extends ResponseMessage<{ error: Error }> {
  type = AppActionType.setError;
}
export class LoadingStartApp extends Message<void> {
  type = AppActionType.loadingStart;
}
export class LoadingStopApp extends Message<void> {
  type = AppActionType.loadingStop;
}
export class InitializeRequestApp extends RequestMessage<void> {
  type = AppActionType.initializeRequest;
}
export class InitializeResponseApp extends ResponseMessage<void> {
  type = AppActionType.initializeResponse;
}

export type AppActions = SetReadyApp
  | SetLoadingApp
  | SetErrorApp
  | LoadingStartApp
  | LoadingStopApp
  | InitializeRequestApp
  | InitializeResponseApp;

export function appStateReducer(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionType.setReady: {
      const p = (action as SetReadyApp).payload;
      return {
        ...state,
        ready: p.ready,
      };
    }
    case AppActionType.setLoading: {
      const p = (action as SetLoadingApp).payload;
      const refCount = state.loadingCountRef + (p.loading ? 1 : -1);
      return {
        ...state,
        loadingCountRef: refCount,
        loading: refCount > 0,
      };
    }
    case AppActionType.setError: {
      const p = (action as SetErrorApp).payload;
      return {
        ...state,
        error: p.error,
      };
    }
    case AppActionType.initializeRequest:
    case AppActionType.initializeResponse:
    case AppActionType.loadingStart:
    case AppActionType.loadingStop:
    default:
      return state;
  }
}

@Injectable()
export class AppFacade {
  app$: Observable<AppState> = this.store.pipe(select(selectAppState));
  ready$: Observable<boolean> = this.store.pipe(select(selectAppReady), filter((ready: boolean) => ready));
  loadingCountRef$: Observable<number> = this.store.pipe(select(selectAppLoadingCountRef));
  loading$: Observable<boolean> = this.store.pipe(select(selectAppLoading));
  error$: Observable<Error> = this.store.pipe(select(selectAppError));
  constructor(
    private store: Store<any>,
  ) {}
  /*
  // Those are private API (should come from Effects)
  setReady(payload: { ready: boolean }) {
    this.store.dispatch(new SetReadyApp(payload));
  }
  setLoading(payload: { loading: boolean }) {
    this.store.dispatch(new SetLoadingApp(payload));
  }
  setError(payload: { error: Error }) {
    this.store.dispatch(new SetErrorApp(payload));
  }
  loadingStart() {
    this.store.dispatch(new LoadingStartApp());
  }
  loadingStop() {
    this.store.dispatch(new LoadingStopApp());
  }
  */
  initializeRequest() {
    this.store.dispatch(new InitializeRequestApp());
  }
}

@Injectable()
export class AppEffects {
  currentLoading: Loading;
  currentAlert: Alert;
  constructor(
    public actions$: Actions,
    public appFacade: AppFacade,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform
  ) {}
  @Effect({ dispatch: false })
  setReadyLog$ = this.actions$.pipe(
    ofType(AppActionType.setReady),
    tap((setReady: SetReadyApp) => console.log('AppEffects@setReady: ', setReady))
  );
  @Effect({ dispatch: false })
  setLoadingLog$ = this.actions$.pipe(
    ofType(AppActionType.setLoading),
    tap((setLoading: SetLoadingApp) => console.log('AppEffects@setLoading: ', setLoading))
  );
  @Effect({ dispatch: false })
  setErrorLog$ = this.actions$.pipe(
    ofType(AppActionType.setError),
    tap((setError: SetErrorApp) => console.log('AppEffects@setError: ', setError))
  );
  @Effect({ dispatch: false })
  loadingStartLog$ = this.actions$.pipe(
    ofType(AppActionType.loadingStart),
    tap((loadingStart: LoadingStartApp) => console.log('AppEffects@loadingStart: ', loadingStart))
  );
  @Effect({ dispatch: false })
  loadingStopLog$ = this.actions$.pipe(
    ofType(AppActionType.loadingStop),
    tap((loadingStop: LoadingStopApp) => console.log('AppEffects@loadingStop: ', loadingStop))
  );
  @Effect({ dispatch: false })
  initializeRequestLog$ = this.actions$.pipe(
    ofType(AppActionType.initializeRequest),
    tap((initializeRequest: InitializeRequestApp) => console.log('AppEffects@initializeRequest: ', initializeRequest))
  );
  @Effect({ dispatch: false })
  initializeResponseLog$ = this.actions$.pipe(
    ofType(AppActionType.initializeResponse),
    tap((initializeResponse: InitializeResponseApp) => console.log('AppEffects@initializeResponse: ', initializeResponse))
  );

  /**
   * Initialize application
   *  - 1) dispatch Initialize App Request
   *  - 2) dispatch Load Storage Request
   *  - 3) wait either for Load Storage Response or App Error
   *  - 4) map to FIRST_USE state or true if an erroroccured
   *  - 5) dispatch the first page state (based on FIRST_USE) an the ready state
   */
  @Effect({ dispatch: true })
  initialize$ = Observable.defer(() => Observable.fromPromise(this.platform.ready())).pipe(
    switchMap(() => {
      const id = Uuid();
      const initialize$ = Observable.of(new InitializeRequestApp(undefined, id));
      const loadRequest$ = Observable.of(new LoadRequestStorage(undefined, id));
      const loadResponse$ = this.actions$.pipe(
        correlated([StorageActionType.loadResponse, AppActionType.setError], id),
        map((response: LoadResponseStorage | SetErrorApp) => {
          return response.type === StorageActionType.loadResponse
            ? {
              firstUse: response.payload.entries.FIRST_USE,
              credentials: response.payload.entries.USER_CREDENTIALS
            } : { firstUse: true };
        }),
        map((data: { firstUse: boolean, credentials: UserCredentials }) => ({
          ...data,
          firstPageId: data.firstUse === false ? 'WELCOME' : 'FIRST_USE',
        })),
        switchMap<any, any>((data: { firstPageId: string, credentials: UserCredentials }) => {
          return data.credentials
            ? Observable.of<any>(
              new AutoSignInRequestUser({ credentials: data.credentials }, id),
              new InitializeResponseApp(undefined, id),
            )
            : Observable.of<any>(
              new ChangeRootNav({ id: data.firstPageId }, id),
              new InitializeResponseApp(undefined, id),
              new SetReadyApp({ ready: true }, id),
            );
        }),
      );
      return Observable.concat(initialize$, loadRequest$, loadResponse$);
    }),
  );
  @Effect({ dispatch: true })
  onAutoSignInResponse$ = this.actions$.pipe(
    ofType(UserActionType.autoSignInResponse),
    map((autoSignInResponse: AutoSignInResponseUser) => new SetReadyApp({ ready: true }, autoSignInResponse.correlationId))
  );
  /**
   * If a Message include a startLoading field set to true, increment loading ref count
   */
  @Effect({ dispatch: true })
  loadingStartMap$ = this.actions$.pipe(
    filter((request: RequestMessage) => request.startLoading === true),
    map((request: RequestMessage) => new SetLoadingApp({ loading: true }, request.correlationId)),
  );
  /**
   * If a Message include a stopLoading field set to true, decrement loading ref count
   */
  @Effect({ dispatch: true })
  loadingStopMap$ = this.actions$.pipe(
    filter((response: ResponseMessage) => response.stopLoading === true),
    map((response: ResponseMessage) => new SetLoadingApp({ loading: false }, response.correlationId)),
  );
  /**
   * On loading state changes, start or stop the loader
   */
  @Effect({ dispatch: false })
  loading$ = this.appFacade.loading$.pipe(
    skip(1),
    distinctUntilChanged(),
    tap((loading: boolean) => {
      if (loading) {
        this.currentLoading = this.loadingCtrl.create({});
        this.currentLoading.onDidDismiss(() => this.currentLoading = undefined);
        this.currentLoading.present();
      } else if (this.currentLoading) {
        this.currentLoading.dismiss();
      }
    })
  );
  /**
   * On error state changes, start or stop the error alert
   */
  @Effect({ dispatch: false })
  error$ = this.appFacade.error$.pipe(
    skip(1),
    distinctUntilChanged(),
    tap((error: Error) => {
      if (error) {
        this.currentAlert = this.alertCtrl.create({
          title: error.name,
          message: error.message,
          buttons: [{ text: 'Ok' }]
        });
        this.currentAlert.onDidDismiss(() => this.currentAlert = undefined);
        this.currentAlert.present();
      } else if (this.currentAlert) {
        this.currentAlert.dismiss();
      }
    })
  );
}
