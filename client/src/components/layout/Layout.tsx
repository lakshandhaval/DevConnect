import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-surface-600 py-6 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} DevConnect. Built for developers, by developers.</p>
    </footer>
  </div>
);

export default Layout;
