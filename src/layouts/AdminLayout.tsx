import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import AdminSidebar from '../components/navigation/AdminSidebar';
import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <motion.div 
          className="fixed inset-0 z-40 flex md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <motion.div 
            className="relative flex w-full max-w-xs flex-1 flex-col bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} isAdmin />
        
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <motion.div 
            className="mx-auto max-w-7xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;