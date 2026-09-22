import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Briefcase, User, LogOut, LayoutDashboard, Bookmark, FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLink = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-surface-700 transition-all duration-150';
  const activeNavLink = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-400 bg-brand-900/30';

  return (
    <nav className="sticky top-0 z-50 bg-surface-800/80 backdrop-blur-md border-b border-surface-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Dev<span className="text-brand-400">Connect</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={({ isActive }) => isActive ? activeNavLink : navLink}>
              <Briefcase className="w-4 h-4" /> Jobs
            </NavLink>
            {user && (
              <>
                <NavLink to="/applications" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                  <FileText className="w-4 h-4" /> Applications
                </NavLink>
                <NavLink to="/saved" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                  <Bookmark className="w-4 h-4" /> Saved
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                  <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                </NavLink>
                <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn-ghost p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-600 bg-surface-800 px-4 pb-4 pt-2 animate-fade-in">
          <div className="flex flex-col gap-1">
            <NavLink to="/jobs" className={({ isActive }) => isActive ? activeNavLink : navLink} onClick={() => setMobileOpen(false)}>
              <Briefcase className="w-4 h-4" /> Jobs
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => isActive ? activeNavLink : navLink} onClick={() => setMobileOpen(false)}>
                  <User className="w-4 h-4" /> Profile
                </NavLink>
                <NavLink to="/applications" className={({ isActive }) => isActive ? activeNavLink : navLink} onClick={() => setMobileOpen(false)}>
                  <FileText className="w-4 h-4" /> Applications
                </NavLink>
                <NavLink to="/saved" className={({ isActive }) => isActive ? activeNavLink : navLink} onClick={() => setMobileOpen(false)}>
                  <Bookmark className="w-4 h-4" /> Saved Jobs
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={({ isActive }) => isActive ? activeNavLink : navLink} onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </NavLink>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink} onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary mt-1" onClick={() => setMobileOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
