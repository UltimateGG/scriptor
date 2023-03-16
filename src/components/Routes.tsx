import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ScriptListPage from '../pages/ScriptListPage';
import ScriptPage from '../pages/ScriptPage';
import LoginPage from '../pages/LoginPage';


const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="scripts" element={
        <ProtectedRoute>
          <ScriptListPage />
        </ProtectedRoute>
      } />

      <Route path="scripts/:scriptId" element={
        <ProtectedRoute>
          <ScriptPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default RoutesComponent;
