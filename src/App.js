import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/admin" element={<BlogAdmin />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
