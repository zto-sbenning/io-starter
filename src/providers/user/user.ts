import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMock, UserProfilMock, UserTokenMock } from '../../mocks/user.mock';
import { UserProfil, UserCredentials, UserToken } from '../../stores/user.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  mock = new UserMock();

  constructor(
    public http: HttpClient,
  ) {
    console.log('Hello UserProvider Provider');
  }

  signUp(profil: Partial<UserProfil>): Observable<UserProfil> {
    return this.mock.signUp(profil);
  }

  signIn(credentials: UserCredentials): Observable<{ profil: UserProfil, token: UserToken }> {
    return this.mock.signIn(credentials).pipe(
      map((resp: { user: UserProfilMock, token: UserTokenMock }) => ({
        profil: resp.user,
        token: resp.token,
      }))
    );
  }

}
