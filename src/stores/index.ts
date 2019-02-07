import { navStateSelector, navStateReducer } from './nav.store';
import { storageStateSelector, storageStateReducer } from './storage.store';
import { appStateSelector, appStateReducer } from './app.store';
import { userStateSelector, userStateReducer } from './user.store';

export const reducers = {
  [navStateSelector]: navStateReducer,
  [storageStateSelector]: storageStateReducer,
  [appStateSelector]: appStateReducer,
  [userStateSelector]: userStateReducer,
};
