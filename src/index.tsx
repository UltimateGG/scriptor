import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import RoutesComponent from './components/Routes';
import { AuthContextProvider } from './contexts/AuthContext';
import { ScriptsContextProvider } from './contexts/ScriptsContext';
import { Theme } from '@ultimategg/jetdesign';

// Init firebase
import './firebase';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Theme theme={{ primary: '#6200EE' }} />

    <HashRouter>
      <AuthContextProvider>
        <ScriptsContextProvider>
          <RoutesComponent />
        </ScriptsContextProvider>
      </AuthContextProvider>
    </HashRouter>
  </React.StrictMode>
);
