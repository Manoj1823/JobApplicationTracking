import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
            <Briefcase size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Job Tracker</h2>
          <p className="text-gray-600 mt-2">Manage your job applications with ease</p>
        </div>
        
        <div className="bg-white shadow-xl rounded-xl p-8">
          <Outlet />
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          © {new Date().getFullYear()} Job Tracker. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;