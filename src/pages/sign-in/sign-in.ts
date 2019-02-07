import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { NavFacade } from '../../stores/nav.store';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  @ViewChild(Navbar) navBar: Navbar;

  signInForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(
    public navFacade: NavFacade,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  createForm() {
    this.emailCtrl = new FormControl('', [Validators.required]),
    this.passwordCtrl = new FormControl('', [Validators.required]),
    this.signInForm = new FormGroup({

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
    this.navBar.backButtonClick = () => this.back();
  }

  back() {
    this.navFacade.popOnRoot();
  }

  signIn() {
    console.log('Should sign in: ', this.signInForm.value);
  }

}
