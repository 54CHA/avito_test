import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ListingsPage } from './pages/ListingsPage';
import { DetailPage } from './pages/DetailPage';
import { StatsPage } from './pages/StatsPage';
import { ThemeContextProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<ListingsPage />} />
            <Route path="/item/:id" element={<DetailPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
