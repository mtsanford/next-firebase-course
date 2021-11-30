import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore } from "../lib/firebase";

// Custom hook to read  auth record and user profile doc
export function useUserData(): { user: User; username: string } {
  const [user] = useAuthState(auth);
  const [username, setUserName] = useState<string>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe: () => void;

    if (user) {
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        console.log(doc.data());
        setUserName(doc.data()?.username);
      });
    } else {
      setUserName(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
