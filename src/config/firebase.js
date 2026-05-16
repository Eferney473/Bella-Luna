// src/config/firebase.js
/* import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; */

// En React Native CLI con las librerías nativas de @react-native-firebase,
// el SDK detecta automáticamente el archivo google-services.json de Android.
// Por lo tanto, solo exportamos los módulos ya inicializados de forma nativa.

/* export const authInstance = auth();
export const db = firestore(); */
/* 
/* NOTA PARA EL FUTURO (App de Escritorio/Web):
  Cuando crees el proyecto del dueño de la tienda en React.js o Electron, 
  allí sí inicializarás usando el SDK web tradicional de esta forma:*/
  
 /*  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getAuth } from "firebase/auth";

  const firebaseConfig = {
     apiKey: "AIzaSyDCXkFyeFbftpKmyls7dwI7g4Q_vPJNHUs",
  authDomain: "bellaluna-2167a.firebaseapp.com",
  projectId: "bellaluna-2167a",
  storageBucket: "bellaluna-2167a.firebasestorage.app",
  messagingSenderId: "845867207640",
  appId: "1:845867207640:web:c39ab13356cb3fb8d440ad",
  measurementId: "G-CMLQRZ9CRZ"
  }; */

  /* const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const authInstance = getAuth(app); */ 

  // src/config/firebase.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// El SDK nativo detecta automáticamente el archivo google-services.json (Android)
// y el GoogleService-Info.plist (iOS), por lo que no necesita el objeto firebaseConfig aquí.
export const authInstance = auth();
export const db = firestore();