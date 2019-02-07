import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, switchMap, filter, first, map, startWith, mergeMap } from 'rxjs/operators';
import { ZtoRouteContext } from '../models/zto-routes';
import { Message } from '../models/message';
import { App, Tabs, MenuController } from 'ionic-angular';
import { NavProvider } from '../providers/nav/nav';
import { Uuid } from '../app/app.tools';
import { LoadRequestStorage, StorageActionType, LoadResponseStorage, SaveRequestStorage } from './storage.store';

export interface NavState {
  root: string;
  menu: ZtoRouteContext[];
  tabs: ZtoRouteContext[];
}

export const initialNavState: NavState = {
  root: 'FIRST_USE',
  menu: [],
  tabs: []
};

export const navStateSelector = 'nav';
export const selectNavState = (states: any) =>
  states[navStateSelector] as NavState;
export const selectNavRoot = createSelector(
  selectNavState,
  (state: NavState) => state.root
);
export const selectNavMenu = createSelector(
  selectNavState,
  (state: NavState) => state.menu
);
export const selectNavTabs = createSelector(
  selectNavState,
  (state: NavState) => state.tabs
);

export enum NavActionType {
  changeRoot = '[Nav] Change Root',
  initMenu = '[Nav] Init Menu',
  initTabs = '[Nav] Init Tabs',
  changeTab = '[Nav] Change Tab',
  setRootOnActiveTab = '[Nav] Set Root OnActive Tab',
  pushOnActiveTab = '[Nav] Push OnActive Tab',
  popOnActiveTab = '[Nav] Pop OnActive Tab'
}

export class ChangeRootNav extends Message<{ id: string }> {
  type = NavActionType.changeRoot;
}
export class InitMenuNav extends Message<{ contexts: ZtoRouteContext[] }> {
  type = NavActionType.initMenu;
}
export class InitTabsNav extends Message<{ contexts: ZtoRouteContext[] }> {
  type = NavActionType.initTabs;
}
export class ChangeTabNav extends Message<{ id: string }> {
  type = NavActionType.changeTab;
}
export class SetRootOnActiveTabNav extends Message<{ id: string }> {
  type = NavActionType.setRootOnActiveTab;
}
export class PushOnActiveTabNav extends Message<{ id: string }> {
  type = NavActionType.pushOnActiveTab;
}
export class PopOnActiveTabNav extends Message<{ id: string }> {
  type = NavActionType.popOnActiveTab;
}

export type NavActions =
  | ChangeRootNav
  | InitMenuNav
  | InitTabsNav
  | ChangeTabNav
  | SetRootOnActiveTabNav
  | PushOnActiveTabNav
  | PopOnActiveTabNav;

export function navStateReducer(
  state: NavState = initialNavState,
  action: NavActions
): NavState {
  switch (action.type) {
    case NavActionType.changeRoot: {
      const p = (action as ChangeRootNav).payload;
      return {
        ...state,
        root: p.id,
      };
    }
    case NavActionType.initMenu: {
      const p = (action as InitMenuNav).payload;
      return {
        ...state,
        menu: p.contexts,
      };
    }
    case NavActionType.initTabs: {
      const p = (action as InitTabsNav).payload;
      return {
        ...state,
        tabs: p.contexts,
      };
    }
    case NavActionType.changeTab: {
      const p = (action as ChangeTabNav).payload;
      return state;
    }
    case NavActionType.setRootOnActiveTab: {
      const p = (action as SetRootOnActiveTabNav).payload;
      return state;
    }
    case NavActionType.pushOnActiveTab: {
      const p = (action as PushOnActiveTabNav).payload;
      return state;
    }
    case NavActionType.popOnActiveTab: {
      const p = (action as PopOnActiveTabNav).payload;
      return state;
    }

    default:
      return state;
  }
}

@Injectable()
export class NavFacade {
  tabsAcc: () => Tabs;
  nav$: Observable<NavState> = this.store.pipe(select(selectNavState));
  root$: Observable<string> = this.store.pipe(select(selectNavRoot));
  menu$: Observable<ZtoRouteContext[]> = this.store.pipe(select(selectNavMenu));
  tabs$: Observable<ZtoRouteContext[]> = this.store.pipe(select(selectNavTabs));
  constructor(private store: Store<any>) { }
  setTabs(tabsAcc: () => Tabs) {
    this.tabsAcc = tabsAcc;
  }
  changeRoot(payload: { id: string }) {
    this.store.dispatch(new ChangeRootNav(payload));
  }
  initMenu(payload: { contexts: ZtoRouteContext[] }) {
    this.store.dispatch(new InitMenuNav(payload));
  }
  initTabs(payload: { contexts: ZtoRouteContext[] }) {
    this.store.dispatch(new InitTabsNav(payload));
  }
  changeTab(payload: { id: string }) {
    this.store.dispatch(new ChangeTabNav(payload));
  }
  setRootOnActiveTab(payload: { id: string }) {
    this.store.dispatch(new SetRootOnActiveTabNav(payload));
  }
  pushOnActiveTab(payload: { id: string }) {
    this.store.dispatch(new PushOnActiveTabNav(payload));
  }
  popOnActiveTab(payload: { id: string }) {
    this.store.dispatch(new PopOnActiveTabNav(payload));
  }
}

@Injectable()
export class NavEffects {
  constructor(
    public actions$: Actions,
    public navFacade: NavFacade,
    public nav: NavProvider,
    public app: App,
    public menuCtrl: MenuController
  ) {
    setTimeout(() => this.menuCtrl.enable(false), 0);
  }
  @Effect({ dispatch: false })
  changeRootLog$ = this.actions$.pipe(
    ofType(NavActionType.changeRoot),
    tap((changeRoot: ChangeRootNav) =>
      console.log('NavEffects@changeRoot: ', changeRoot)
    )
  );
  @Effect({ dispatch: false })
  changeRoot$ = this.actions$.pipe(
    ofType(NavActionType.changeRoot),
    tap((changeRoot: ChangeRootNav) => {
      this.menuCtrl.enable(changeRoot.payload.id === 'TABS');
      this.app.getRootNav().setRoot(NavProvider.routes[changeRoot.payload.id].page);
    })
  );
  @Effect({ dispatch: false })
  initMenuLog$ = this.actions$.pipe(
    ofType(NavActionType.initMenu),
    tap((initMenu: InitMenuNav) =>
      console.log('NavEffects@initMenu: ', initMenu)
    )
  );
  @Effect({ dispatch: false })
  initTabsLog$ = this.actions$.pipe(
    ofType(NavActionType.initTabs),
    tap((initTabs: InitTabsNav) =>
      console.log('NavEffects@initTabs: ', initTabs)
    )
  );
  @Effect({ dispatch: false })
  changeTabLog$ = this.actions$.pipe(
    ofType(NavActionType.changeTab),
    tap((changeTab: ChangeTabNav) =>
      console.log('NavEffects@changeTab: ', changeTab)
    )
  );
  @Effect({ dispatch: false })
  setRootOnActiveTabLog$ = this.actions$.pipe(
    ofType(NavActionType.setRootOnActiveTab),
    tap((setRootOnActiveTab: SetRootOnActiveTabNav) =>
      console.log('NavEffects@setRootOnActiveTab: ', setRootOnActiveTab)
    )
  );
  @Effect({ dispatch: false })
  pushOnActiveTabLog$ = this.actions$.pipe(
    ofType(NavActionType.pushOnActiveTab),
    tap((pushOnActiveTab: PushOnActiveTabNav) =>
      console.log('NavEffects@pushOnActiveTab: ', pushOnActiveTab)
    )
  );
  @Effect({ dispatch: false })
  popOnActiveTabLog$ = this.actions$.pipe(
    ofType(NavActionType.popOnActiveTab),
    tap((popOnActiveTab: PopOnActiveTabNav) =>
      console.log('NavEffects@popOnActiveTab: ', popOnActiveTab)
    )
  );
}
