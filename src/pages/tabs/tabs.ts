import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { ZtoRouteContext } from '../../models/zto-routes';
import { NavFacade } from '../../stores/nav.store';
import { NavProvider } from '../../providers/nav/nav';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabs$: Observable<ZtoRouteContext[]> = this.navFacade.tabs$.pipe(tap(console.log));

  @ViewChild(Tabs) tabsEl: Tabs;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navFacade: NavFacade,
    public nav: NavProvider,
  ) {
    this.navFacade.setTabs(() => this.tabsEl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  getRoot(id: string): any {
    return this.nav.getPage(id);
  }

}
