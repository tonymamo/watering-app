import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from 'firebase/app';

import configureStore from './configureStore';

export const initialState = process.env.BROWSER // eslint-disable-next-line no-underscore-dangle
  ? window.__INITIAL_STATE__
  : {
      firestore: {},
      firebase: {},
    };
const { store, persistor } = configureStore(initialState);

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  profileFactory: (userData: firebase.User) => {
    // how profiles are stored in database
    return {
      email: userData?.email,
    };
  },
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // since we are using Firestore
};

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

const ReduxWrapper: FunctionComponent<{ element: any }> = ({ element }) => (
  <Provider store={store}>
    {typeof window !== 'undefined' ? (
      <ReactReduxFirebaseProvider {...rrfProps}>
        <PersistGate loading={null} persistor={persistor}>
          {element}
        </PersistGate>
      </ReactReduxFirebaseProvider>
    ) : (
      element
    )}
  </Provider>
);

export default ReduxWrapper;
