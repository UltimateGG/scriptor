import React from 'react';
import ReactDOM from 'react-dom/client';
import { JetDesign } from './Jet';
import { HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoutesComponent from './components/Routes';
import { AuthContextProvider } from './contexts/AuthContext';
import { ScriptsContextProvider } from './contexts/ScriptsContext';

// Init firebase
import './firebase';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <HashRouter>
        <AuthContextProvider>
          <ScriptsContextProvider>
            <RoutesComponent />

            <Navbar />
          </ScriptsContextProvider>
        </AuthContextProvider>
      </HashRouter>
    </JetDesign>
  </React.StrictMode>
);
