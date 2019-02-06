import { navStateSelector, navStateReducer } from './nav.store';
import { storageStateSelector, storageStateReducer } from './storage.store';

export const reducers = {
  [navStateSelector]: navStateReducer,
  [storageStateSelector]: storageStateReducer,
};
