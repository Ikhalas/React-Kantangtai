import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyB0W7WxsUcJoxdeIGrSGhveD1l5hqfjPyk",
    authDomain: "kantangtai-water.firebaseapp.com",
    databaseURL: "https://kantangtai-water.firebaseio.com",
    projectId: "kantangtai-water",
    storageBucket: "kantangtai-water.appspot.com",
    messagingSenderId: "291072170495",
    appId: "1:291072170495:web:140a51f34a6fd28e53afca",
    measurementId: "G-FR9JZ4XD2Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()

export default firebaseConfig