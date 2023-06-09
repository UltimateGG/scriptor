import { onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { db, Script } from '../firebase';
import useAuthContext from './AuthContext';


interface IScriptsContext {
  scripts: Script[];
  loadingScripts: boolean;
}

export const ScriptsContext = React.createContext<IScriptsContext | undefined>(undefined);
export const ScriptsContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loadingScripts, setLoadingScripts] = useState(true);
  const { user } = useAuthContext();


  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'scripts'), snapshot => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const keys = Object.keys(val);
        const scripts: Script[] = [];

        keys.forEach(key => {
          scripts.push({
            id: key,
            ...val[key],
            shots: val[key].shots ? Object.keys(val[key].shots).map(shotKey => ({ id: shotKey, ...val[key].shots[shotKey] })) : [],
          });
        });

        setScripts(scripts);
      } else {
        setScripts([]);
      }
      
      setLoadingScripts(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <ScriptsContext.Provider value={{ scripts, loadingScripts }}>
      {children}
    </ScriptsContext.Provider>
  );
};

const useScriptsContext = () => {
  const context = useContext(ScriptsContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useScriptsContext;
