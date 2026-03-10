import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

    // Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
        user_id: user.uid,
        email: user.email,
        created_at: serverTimestamp(),
        experiments_completed: 0,
        latest_manipulation_index: null,
    });

    return user;
};

export const logIn = async (email, password) => {
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

export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};
