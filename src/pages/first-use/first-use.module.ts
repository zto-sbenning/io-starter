import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstUsePage } from './first-use';

@NgModule({
  declarations: [
    FirstUsePage,
  ],
  imports: [
    IonicPageModule.forChild(FirstUsePage),
  ],
})
export class FirstUsePageModule {}
