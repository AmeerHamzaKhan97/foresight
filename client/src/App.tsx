import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import CreatorProfile from '@/pages/CreatorProfile';
import './App.css';

function App() {
  return (
    <Layout>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid #27272a',
        },
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/creator/:handle" element={<CreatorProfile />} />
      </Routes>
    </Layout>
  );
}

export default App;
