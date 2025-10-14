import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    createdAt: Timestamp.now(),
  });

  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};
