import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { NavFacade } from '../../stores/nav.store';
import { UserFacade } from '../../stores/user.store';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  @ViewChild(Navbar) navbar: Navbar;

  signUpForm: FormGroup;
  emailCtrl: FormControl;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;

  constructor(
    public navFacade: NavFacade,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userFacade: UserFacade
  ) {
    this.createForm();
  }

  createForm() {
    this.emailCtrl = new FormControl('', [Validators.required]),
    this.usernameCtrl = new FormControl('', [Validators.required]),
    this.passwordCtrl = new FormControl('', [Validators.required]),
    this.confirmPasswordCtrl = new FormControl('', [Validators.required, () => this.comparePassword()]),
    this.signUpForm = new FormGroup({
      emailCtrl: this.emailCtrl,
      usernameCtrl: this.usernameCtrl,
      passwordCtrl: this.passwordCtrl,
      confirmPasswordCtrl: this.confirmPasswordCtrl,
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
    this.navbar.backButtonClick = () => this.back();
  }

  back() {
    this.navFacade.popOnRoot();
  }

  comparePassword() {
    if (!this.passwordCtrl || !this.confirmPasswordCtrl) {
      return null;
    }
    return this.passwordCtrl.value === this.confirmPasswordCtrl.value
      ? null
      : { noMatch: 'Confirm Password do not match Password.' };
  }

  signUp() {
    this.userFacade.signUpRequest({
      profil: {
        email: this.emailCtrl.value,
        username: this.usernameCtrl.value,
        password: this.passwordCtrl.value,
      }
    });
  }

}
