import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";
import firebase from "firebase/compat/app";

// Two constants which we will write to
// the Realtime database when this device is offline
// or online. (copied from https://firebase.google.com/docs/firestore/solutions/presence)
export const isOfflineForDatabase = {
  state: "offline",
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: "online",
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};
const ProfileContext = createContext();
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    //adding real time listener which will run everytime anything changes inside the path specified
    const authUnsub = auth.onAuthStateChanged((authObj) => {
      //onAuthStateChanged works for logged in user
      if (authObj) {
        // Create a reference to this user's specific status node.
        // This is where we will store data about being online/offline.
        userStatusRef = database.ref(`/status/${authObj.uid}`);

        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on("value", (snap) => {
          const profileData = snap.val();
          const { name, createdAt, avatar } = snap.val();
          const data = {
            name,
            avatar,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });

        // Create a reference to the special '.info/connected' path in
        // Realtime Database. This path returns `true` when connected
        // and `false` when disconnected.
        database.ref(".info/connected").on("value", (snapshot) => {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() === false) {
            return;
          }

          // If we are currently connected, then use the 'onDisconnect()'
          // method to add a set which will only trigger once this
          // client has disconnected by closing the app,
          // losing internet, or any other means.
          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect()
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) {
          userRef.off();
        }
        if (userStatusRef) {
          userStatusRef.off();
        }
        database.ref(".info/connected").off();
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsub();
      if (userRef) {
        userRef.off();
      }
      if (userStatusRef) {
        userStatusRef.off();
      }
      database.ref(".info/connected").off();
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ isloading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};
export const useProfile = () => useContext(ProfileContext);
