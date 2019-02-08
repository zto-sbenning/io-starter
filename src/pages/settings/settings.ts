import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageFacade, Entries } from '../../stores/storage.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZObject } from '../../app/app.tools';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  entries$: Observable<{ key: string, value: string }[]> = this.storageFacade.entries$.pipe(
    map((entries: Entries) => ZObject.entries(entries)
      .map(([key, value]: [string, any]) => ({ key, value }))
    )
  );

  entryForm: FormGroup;
  keyCtrl: FormControl;
  valueCtrl: FormControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageFacade: StorageFacade
  ) {
    this.createForm();
  }

  createForm() {
    this.keyCtrl = new FormControl('', [Validators.required]);
    this.valueCtrl = new FormControl('', [Validators.required]);
    this.entryForm = new FormGroup({
      key: this.keyCtrl,
      value: this.valueCtrl
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save() {
    const entry = {
      [this.keyCtrl.value]: JSON.parse(this.valueCtrl.value),
    };
    this.storageFacade.saveRequest({ entries: entry });
  }

  update(entry: { key: string, value: any }) {
    this.keyCtrl.setValue(entry.key);
    this.valueCtrl.setValue(JSON.stringify(entry.value));
  }

  remove(entry: { key: string, value: any }) {
    this.storageFacade.removeRequest({ keys: [entry.key] });
  }

  clear() {
    this.storageFacade.clearRequest();
  }

}
