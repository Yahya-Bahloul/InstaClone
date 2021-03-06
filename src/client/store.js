import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
//import {AsyncStorage} from 'react-native'

import loginReducer from "./reducers/loginReducer";
import signupReducer from "./reducers/signupReducer";
import postsReducer from "./reducers/postsReducer";

// rootRecuder is now being put in this file (Store.js)
const rootReducer = combineReducers({
  loginReducer: loginReducer,
  signupReducer: signupReducer,
  postsReducer: postsReducer,
});

const persistConfig = {
  key: "root",
  // storage method
  storage: AsyncStorage,
  // things you want to persist
  whitelist: ["loginReducer", "signupReducer"],
  // things you don't want to persist
  blacklist: [
    //'signupReducer',
  ],
};

// print the store without import redux store
AsyncStorage.getAllKeys((err, keys) => {
  AsyncStorage.multiGet(keys, (error, stores) => {
    stores.map((result, i, store) => {
      console.log({ [store[i][0]]: store[i][1] });
      return true;
    });
  });
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, {}, applyMiddleware(thunk));
export const persistor = persistStore(store);
