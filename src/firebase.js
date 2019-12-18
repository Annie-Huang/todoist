import firebase from "firebase/app";
import 'firebase/firebase-firestore'

const firebaseConfig = firebase.initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBukcet: '',
    messageSenderId: '',
    apiId: '',
});

export {firebaseConfig as firebase};
