import firebase from 'firebase';
// import firebaseApiKey from git ignored file containing the following export
// export const firebaseApiKey = 'api key here';
import { firebaseApiKey } from './firebaseApiKey';
const firebaseURL = 'https://catch-of-the-day-react-app.firebaseio.com/';

var config = {
  apiKey: firebaseApiKey,
  authDomain: 'catch-of-the-day-react-app.firebaseapp.com',
  databaseURL: firebaseURL,
  storageBucket: 'catch-of-the-day-react-app.appspot.com'
};

import Rebase from 're-base';
export const base = Rebase.createClass(config);

// firebaseRef may not be necessary
export const firebaseRef = base.database().ref();
export const githubProvider = new firebase.auth.GithubAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();
