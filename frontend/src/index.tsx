import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserInput } from './components/UserInput/UserInput';
import { Registration } from './components/Registration/Registration';
import { Admin } from './components/Admin/Admin';
import { Welcome } from './components/Welcome/Welcome';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserInput />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<ProtectedRoute child="admin"><Admin /></ProtectedRoute>} />
        <Route path="/welcome" element={<ProtectedRoute ><Welcome /></ProtectedRoute>} />
        <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
