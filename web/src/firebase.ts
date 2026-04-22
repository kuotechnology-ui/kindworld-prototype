import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA6BcnCRpSKtzejsV4_T_vG620ZldGbKmU',
  authDomain: 'kindworld-b4063.firebaseapp.com',
  projectId: 'kindworld-b4063',
  storageBucket: 'kindworld-b4063.firebasestorage.app',
  messagingSenderId: '485016011381',
  appId: '1:485016011381:web:62ed00def62674e3e0ee3c'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
