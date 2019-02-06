import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers } from '../stores/index';

import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { NavProvider } from '../providers/nav/nav';

import { HomePageModule } from '../pages/home/home.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { AboutPageModule } from '../pages/about/about.module';
import { FirstUsePageModule } from '../pages/first-use/first-use.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { SignInPageModule } from '../pages/sign-in/sign-in.module';
import { SignUpPageModule } from '../pages/sign-up/sign-up.module';
import { NavEffects, NavFacade } from '../stores/nav.store';
import { appRoutes } from './app.routes';
import { StorageFacade, StorageEffects } from '../stores/storage.store';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      NavEffects,
      StorageEffects
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    FirstUsePageModule,
    WelcomePageModule,
    SignInPageModule,
    SignUpPageModule,
    TabsPageModule,
    HomePageModule,
    SettingsPageModule,
    AboutPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageProvider,
    UserProvider,
    NavEffects,
    NavProvider.forRoot(appRoutes),
    NavFacade,
    StorageFacade,
    StorageEffects,
  ]
})
export class AppModule {}
