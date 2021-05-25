import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCYRD0i2uZ4NEOKn6D7ukRp6zeq7PCw1X4",
  authDomain: "whatsapp-2-e41f2.firebaseapp.com",
  projectId: "whatsapp-2-e41f2",
  storageBucket: "whatsapp-2-e41f2.appspot.com",
  messagingSenderId: "518750801056",
  appId: "1:518750801056:web:8f0ebd6d1e09aed8b80dc5"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };