import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Observable } from 'rxjs';
import { NavFacade } from '../stores/nav.store';
import { ZtoRouteContext } from '../models/zto-routes';
import { NavProvider } from '../providers/nav/nav';
import { StorageFacade } from '../stores/storage.store';
import { switchMap, map, filter } from 'rxjs/operators';
import { AppFacade } from '../stores/app.store';
import { StoreGeneratorProvider } from '../providers/store-generator/store-generator';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  root$: Observable<string> = this.navFacade.root$;
  menu$: Observable<Array<ZtoRouteContext>> = this.navFacade.menu$;

  t;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public navFacade: NavFacade,
    public navProvider: NavProvider,
    public appFacade: AppFacade,
    public g: StoreGeneratorProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.appFacade.ready$.subscribe(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(id: string) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    this.navFacade.changeTab({ id })
  }

  getPage(id: string): any {
    return this.navProvider.getPage(id);
  }
}
