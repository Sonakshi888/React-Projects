import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";

const ProfileContext = createContext();
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    //adding real time listener which will run everytime anything changes inside the path specified
    const authUnsub = auth.onAuthStateChanged((authObj) => {
      //onAuthStateChanged works for logged in user
      if (authObj) {
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on("value", (snap) => {
          const profileData = snap.val();
          const { name, createdAt } = snap.val();
          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
      } else {
        if (userRef) {
          userRef.off();
        }
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnsub();
      if (userRef) {
        userRef.off();
      }
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ isloading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};
export const useProfile = () => useContext(ProfileContext);
