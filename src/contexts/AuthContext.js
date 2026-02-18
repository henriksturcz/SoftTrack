import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToFirestore = async (uid, data) => {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  };

  const register = async (email, password, firstName, lastName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (firstName || lastName) {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim()
      });
    }
    await saveUserToFirestore(user.uid, {
      uid: user.uid,
      email: user.email,
      firstName: firstName || "",
      lastName: lastName || "",
      displayName: `${firstName} ${lastName}`.trim(),
      photoURL: null,
      provider: "email",
      role: "user",
      isPremium: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return result;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const nameParts = (user.displayName || "").split(" ");
      const firstName = nameParts.slice(1).join(" ") || "";
      const lastName = nameParts[0] || "";

      await saveUserToFirestore(user.uid, {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: user.displayName || "",
        photoURL: user.photoURL || null,
        provider: "google",
        role: "user",
        isPremium: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return result;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const getErrorKey = (errorCode) => {
    const errorMap = {
      "auth/invalid-email":        "auth.errors.invalidEmail",
      "auth/email-already-in-use": "auth.errors.emailInUse",
      "auth/weak-password":        "auth.errors.weakPassword",
      "auth/wrong-password":       "auth.errors.wrongPassword",
      "auth/user-not-found":       "auth.errors.userNotFound",
      "auth/too-many-requests":    "auth.errors.tooManyRequests",
      "auth/invalid-credential":   "auth.errors.wrongPassword",
      "auth/popup-closed-by-user": "auth.errors.popupClosed",
      "auth/cancelled-popup-request": "auth.errors.popupClosed"
    };
    return errorMap[errorCode] || "auth.errors.generic";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    getErrorKey,
    isAdmin:   userProfile?.role === "admin",
    isPremium: userProfile?.isPremium || userProfile?.role === "admin"
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};