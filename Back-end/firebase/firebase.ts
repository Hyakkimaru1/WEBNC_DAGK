import firebase from "firebase";
export const firebaseConfig = {
  apiKey: "AIzaSyA8W1cI4fi67t05azlgfCj9i_zvmNkh_kU",
  authDomain: "dack-d233d.firebaseapp.com",
  projectId: "dack-d233d",
  storageBucket: "dack-d233d.appspot.com",
  messagingSenderId: "274785163134",
  appId: "1:274785163134:web:70e0c827dc4bd1f63d452f",
  measurementId: "G-EE3TS8L5HB",
};

firebase.initializeApp(firebaseConfig);
// const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const providerfb:any = new firebase.auth.FacebookAuthProvider();

export { auth, provider, providerfb };
// export default db;
