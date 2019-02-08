import { Observable } from 'rxjs';
import { Uuid } from '../app/app.tools';
import { map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserCredentialsMock {
  login: string;
  password: string;
}
export interface UserProfilMock {
  id: string;
  email: string;
  password: string;
  username: string;
}
export interface UserTokenMock {
  token: string;
}

export interface CredentialTokenUserMock {
  credentials: UserCredentialsMock;
  user: UserProfilMock;
  token: UserTokenMock;
}

export class UserMock {
  static usersStorageKey = 'MOCK_USER_USERS';
  static delay = 0;
  static errorRate = 0.1;

  list: { [basicAt: string]: CredentialTokenUserMock };

  constructor() {
    this.list = JSON.parse(localStorage.getItem(UserMock.usersStorageKey) || '{}');
  }

  signUp(partialUser: Partial<UserProfilMock>): Observable<UserProfilMock> {
    return Observable.defer(() => {
      const user = {
        email: partialUser.email,
        password: partialUser.password,
        username: partialUser.username,
        id: Uuid(),
      };
      const credentials = {
        login: user.email,
        password: user.password,
      };
      const token = {
        token: Uuid()
      };
      this.list[`${credentials.login}@${credentials.password}`] = { credentials, user, token };
      localStorage.setItem(UserMock.usersStorageKey, JSON.stringify(this.list));
      return Observable.timer(UserMock.delay).pipe(
        switchMap(() => Math.random() < UserMock.errorRate
          ? Observable.throw(new HttpErrorResponse({ error: 'MOCK: Cannot create user. Service randomly stoped.', status: 500 }))
          : Observable.of(0)
        ),
        map(() => user),
      );
    });
  }

  signIn(credentials: UserCredentialsMock): Observable<{ user: UserProfilMock, token: UserTokenMock }> {
    return Observable.defer(() => {
      const item = this.list[`${credentials.login}@${credentials.password}`];
      if (!item) {
        return Observable.throw(new HttpErrorResponse({ error: 'Wrong Credentials', status: 401 }));
      }
      return Observable.timer(UserMock.delay).pipe(
        switchMap(() => Math.random() < UserMock.errorRate
          ? Observable.throw(new HttpErrorResponse({ error: 'MOCK: Cannot create user. Service randomly stoped.', status: 500 }))
          : Observable.of(0)
        ),
        map(() => ({ user: item.user, token: item.token })),
      );
    });
  }
}
