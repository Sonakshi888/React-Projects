import { useCallback, useState, useEffect } from "react";
import { database } from "./firebase";

// function to open and close a modal
export function useModalState(defaultValue = false) {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

// function to use when screen is adjusted to mobile and back to desktop
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = (evt) => setMatches(evt.matches);

    queryList.addListener(listener);
    return () => queryList.removeListener(listener);
  }, [query]);

  return matches;
};

// function to get the user online and offline status from realtime database
export function usePresence(uid) {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    const userStatusRef = database.ref(`/status/${uid}`); //getting the user status data
    userStatusRef.on("value", (snap) => { //adding real time listener on value
      if (snap.exists()) {
        const data = snap.val();  //get the snap value into data
        setPresence(data);
      }
    });

    //clean up function to unsubscribe from real time listener
    return () => {
      userStatusRef.off();
    };
  }, [uid]);

  return presence;
}
