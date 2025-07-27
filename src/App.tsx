import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './stores/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { PlaceholderView } from './components/features/PlaceholderView';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<PlaceholderView />} />
            <Route path="/placeholder" element={<PlaceholderView />} />
            <Route path="/api" element={<div className="p-6">API Integration (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="p-6">Settings (Coming Soon)</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}

export default App;