import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavFacade } from '../../stores/nav.store';
import { StorageFacade } from '../../stores/storage.store';

/**
 * Generated class for the FirstUsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-use',
  templateUrl: 'first-use.html',
})
export class FirstUsePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navFacade: NavFacade,
    public storageFacade: StorageFacade,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstUsePage');
  }

  getStarted() {
    this.storageFacade.saveRequest({ entries: { FIRST_USE: false } });
    this.navFacade.changeRoot({ id: 'WELCOME' });
  }

}
