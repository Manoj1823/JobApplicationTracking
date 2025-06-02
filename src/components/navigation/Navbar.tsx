import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
  isAdmin?: boolean;
}

const Navbar = ({ onMenuClick, isAdmin = false }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 md:hidden"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-4 md:ml-0">
            <h1 className="text-xl font-bold text-gray-900">
              {isAdmin ? 'Admin Dashboard' : 'Job Tracker'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="relative p-1 text-gray-400 hover:text-gray-500"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center space-x-2 text-sm text-gray-700"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <User size={18} className="text-primary-600" />
              </div>
              <span className="hidden md:block font-medium">{user?.name}</span>
              <ChevronDown size={16} className="hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </div>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </div>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;