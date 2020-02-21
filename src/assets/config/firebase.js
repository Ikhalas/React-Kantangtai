import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyBNVDXi3YtuihcHAoClQXjqjlX9Io31FC4",
    authDomain: "kantangtai-kantang.firebaseapp.com",
    databaseURL: "https://kantangtai-kantang.firebaseio.com",
    projectId: "kantangtai-kantang",
    storageBucket: "kantangtai-kantang.appspot.com",
    messagingSenderId: "392240924223",
    appId: "1:392240924223:web:99b69f416f7c99b4239a8a",
    measurementId: "G-E5WZ5C72HV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()

export default firebaseConfig