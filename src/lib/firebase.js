import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD1Szd4I2YkK3TxJUtU8u7uX800LRtAJPM',
  authDomain: 'isuru-portfolio-92a51.firebaseapp.com',
  projectId: 'isuru-portfolio-92a51',
  storageBucket: 'isuru-portfolio-92a51.firebasestorage.app',
  messagingSenderId: '599208897375',
  appId: '1:599208897375:web:749313765227bf42ace4ea',
}

const app = initializeApp(firebaseConfig)
export const db  = getFirestore(app)
