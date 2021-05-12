  import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBzSWWD7cfQV5wzR5hR3iu_BKAEdMcGEs0",
    authDomain: "meet-up-19c22.firebaseapp.com",
    projectId: "meet-up-19c22",
    storageBucket: "meet-up-19c22.appspot.com",
    messagingSenderId: "675281616945",
    appId: "1:675281616945:web:88eb2fe14745b983fc9510",
    measurementId: "G-M40X1BBCQV"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};