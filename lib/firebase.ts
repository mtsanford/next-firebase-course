import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, limit, DocumentSnapshot, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDR2Kgo8hkISrTvtzWvd8NIh3X4eWcEpUo",
  authDomain: "next-firebase-demo-fb50c.firebaseapp.com",
  projectId: "next-firebase-demo-fb50c",
  storageBucket: "next-firebase-demo-fb50c.appspot.com",
  messagingSenderId: "234801471454",
  appId: "1:234801471454:web:cde0b5a887edea942e874f",
  measurementId: "G-QNQPZ4W3T6",
};

export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const qs = await getDocs(q);
  const userDoc = qs.docs[0];
  return userDoc;
}

export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

export const fromMillis = Timestamp.fromMillis;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
