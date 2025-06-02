import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

const AdminSidebar = ({ mobile = false, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'User Activity', to: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', to: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 py-5">
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </Link>
        
        {mobile && onClose && (
          <button 
            type="button" 
            className="text-gray-500"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.name}
                to={item.to}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={mobile && onClose ? onClose : undefined}
              >
                <div className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  {item.icon}
                </div>
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="flex flex-shrink-0 p-4">
        <Link
          to="/"
          className="w-full rounded-md bg-gray-100 p-4 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          Back to App
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;