import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const config = {
  apiKey: "AIzaSyDV1A-i-FJmDx1Gz-t9eqZAFojlSTtQ93M",
  authDomain: "chat-web-app-7176f.firebaseapp.com",
  databaseURL: "https://chat-web-app-7176f-default-rtdb.firebaseio.com",
  projectId: "chat-web-app-7176f",
  storageBucket: "chat-web-app-7176f.appspot.com",
  messagingSenderId: "189116362691",
  appId: "1:189116362691:web:58440f3542c4a9c5241776",
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
