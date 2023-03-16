import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import LoadingScreen from '../pages/LoadingScreen';
import UnauthorizedPage from '../pages/UnauthorizedPage';


interface IAuthContext {
  user: User | null;
  allowedUsers: string[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);

  const [loggingIn, setLoggingIn] = useState(true);
  const [authenticating, setAuthenticating] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (!user) {
        setUser(null);
        setLoggingIn(false);
        return;
      }

      setUser(user);
      setLoggingIn(false);
    });

    if (allowedUsers.length === 0) populateAllowedUsers();
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const populateAllowedUsers = async () => {
    const temp = [];

    try {
      const snapshot = await get(ref(db, 'allowedUsers'));
      if (snapshot.exists()) {
        const val = snapshot.val();
        Object.keys(val).forEach((key: string) => {
          if (val[key] === true) temp.push(key);
        });
      }
    } catch (err) {
      console.error('Error loading user whitelist', err);
    }

    if (temp.length === 0) temp.push('_'); // to prevent infinite loop
    setAllowedUsers(temp);
    setAuthenticating(false);
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const getLoadingScreenStatus = () => {
    if (loggingIn) return 'Logging in...';
    if (authenticating) return 'Authenticating...';
    return 'Loading...';
  }

  const getContent = () => {
    if (loggingIn || authenticating)
      return (<LoadingScreen status={getLoadingScreenStatus()} />);
    
    if (user != null && !allowedUsers.includes(user.uid))
      return (<UnauthorizedPage />);

    return children;
  }

  return (
    <AuthContext.Provider value={{ user, allowedUsers, signInWithGoogle, logout }}>
      {getContent()}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useAuthContext;
