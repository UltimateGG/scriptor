import React, { useContext, useEffect, useState } from 'react';
import { Script } from '../firebase';


interface IScriptsContext {
  scripts: Script[];
  loadingScripts: boolean;
}

export const ScriptsContext = React.createContext<IScriptsContext | undefined>(undefined);
export const ScriptsContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loadingScripts, setLoadingScripts] = useState(true);


  useEffect(() => {
    if (scripts.length !== 0) return;
    
    
  }, [scripts]);

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
