import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoreGeneratorProvider } from '../../providers/store-generator/store-generator';
import { tap } from 'rxjs/operators';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  generated: string;
  filename: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public g: StoreGeneratorProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  generate() {
    this.g.generate(`assets/schemas/${this.filename}.json`).pipe(tap(t => this.generated = t)).subscribe();
  }

}
