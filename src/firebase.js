import firebase from "firebase/app";
import 'firebase/firebase-firestore'

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyC9KP-3Iq-i9iBfn-Y7XVBNG3qPnOQWcTI",
    authDomain: "todolist-7fcaf.firebaseapp.com",
    databaseURL: "https://todolist-7fcaf.firebaseio.com",
    projectId: "todolist-7fcaf",
    storageBucket: "todolist-7fcaf.appspot.com",
    messagingSenderId: "863176982186",
    appId: "1:863176982186:web:6ab4a188c9dff773029ad3"
});

export {firebaseConfig as firebase};
