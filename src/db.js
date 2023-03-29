import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  collection,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const collections = {
  todo: "todo",
  category: "category",
};

/** DB Functions */

export async function getItem(id) {
  const itemRef = doc(db, collections.todo, id);
  const snapshot = await getDoc(itemRef);
  if (!snapshot.exists()) return undefined;
  return {
    ...snapshot.data(),
    id,
  };
}

export async function addItem(data) {
  const itemRef = collection(db, collections.todo);
  await addDoc(itemRef, {
    ...data,
    taskLower: data.task.toLowerCase(),
  });
}

export async function updateItem(itemId, data) {
  const itemRef = doc(db, collections.todo, itemId);
  await updateDoc(itemRef, {
    ...data,
    ...(data.task && { taskLower: data.task.toLowerCase() }),
  });
}

export async function removeItem(itemId) {
  await deleteDoc(doc(db, collections.todo, itemId));
}

export async function getCategories() {
  const q = query(collection(db, collections.category), orderBy("priority"));
  const categories = [];
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    categories.push({ ...doc.data(), id: doc.id });
  });
  return categories;
}
