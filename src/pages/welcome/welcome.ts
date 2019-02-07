import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavFacade } from '../../stores/nav.store';
import { StoreGeneratorProvider } from '../../providers/store-generator/store-generator';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  t;

  constructor(
    public navFacde: NavFacade,
    public navCtrl: NavController,
    public navParams: NavParams,
    public g: StoreGeneratorProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');

    // this.g.generate('assets/schemas/user.json').subscribe(g => this.t = g);
  }

  signIn() {
    this.navFacde.pushOnRoot({ id: 'SIGN_IN' });
  }

  signUp() {
    this.navFacde.pushOnRoot({ id: 'SIGN_UP' });
  }

}
