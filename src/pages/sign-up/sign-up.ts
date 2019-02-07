import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { NavFacade } from '../../stores/nav.store';

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
  ) {}

  createForm() {
    this.emailCtrl = new FormControl('', [Validators.required]),
    this.usernameCtrl = new FormControl('', [Validators.required]),
    this.passwordCtrl = new FormControl('', [Validators.required]),
    this.confirmPasswordCtrl = new FormControl('', [Validators.required, () => this.comparePassword()]),
    this.signUpForm = new FormGroup({

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
    return this.passwordCtrl.value === this.confirmPasswordCtrl.value
      ? null
      : { noMatch: 'Confirm Password do not match Password.' };
  }

  signUp() {
    console.log('Should sign up: ', this.signUpForm.value);
  }

}
