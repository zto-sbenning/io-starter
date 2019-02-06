import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavFacade } from '../../stores/nav.store';
import { ZtoRoutes, ZtoRoute, ZtoRouteContext } from '../../models/zto-routes';
import { ZObject } from '../../app/app.tools';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

/*
  Generated class for the NavProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NavProvider {
  static forRoot(appRoutes: ZtoRoutes): typeof NavProvider {
    NavProvider.routes = appRoutes;
    ZObject.entries(NavProvider.routes).forEach(([, route]: [string, ZtoRoute]) => {
      ZObject.entries(route.contexts || {}).forEach(([, ctx]: [string, ZtoRouteContext]) => {
        ctx.id = route.id;
      });
    });
    return NavProvider;
  }
  static routes: ZtoRoutes;

  /**
   * @TODO Why cannot Inject???
   */
  navFacade: NavFacade;
  constructor(
    // public _navFacade: NavFacade,
    public store: Store<any>,
  ) {
    this.navFacade = new NavFacade(store);
    console.log('Hello NavProvider Provider');
    const getContexts = (ctx: string) =>
      ZObject.entries(NavProvider.routes)
        .filter(([, route]: [string, ZtoRoute]) => route && route.contexts && route.contexts[ctx])
        .map(([, route]: [string, ZtoRoute]) => route.contexts[ctx]);
    const tabsContexts = getContexts('tabs');
    const menuContexts = getContexts('menu');
    this.navFacade.initTabs({ contexts: tabsContexts });
    this.navFacade.initMenu({ contexts: menuContexts });
  }

  getPage(id: string): any {
    return NavProvider.routes[id].page;
  }
}
