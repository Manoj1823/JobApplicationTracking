import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users,
  Activity,
  UserCheck,
  Calendar,
  UserPlus,
  LogIn
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
      return response.data;
    },
  });

  const { data: activityData = {}, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/activity`);
      return response.data;
    },
  });

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalLogins: 0,
    avgJobsPerUser: 0,
  });

  useEffect(() => {
    if (users.length > 0 && activityData.logins) {
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter((user: any) => 
        new Date(user.createdAt).toISOString().split('T')[0] === today
      ).length;
      
      const activeUserIds = new Set(activityData.logins.map((login: any) => login.userId));
      
      setStats({
        totalUsers: users.length,
        activeUsers: activeUserIds.size,
        newUsersToday,
        totalLogins: activityData.logins?.length || 0,
        avgJobsPerUser: Math.round((activityData.totalJobs || 0) / (users.length || 1)),
      });
    }
  }, [users, activityData]);

  // Mock data for user growth chart
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Users',
        data: [12, 19, 25, 31, 42, 56, 70, 84, 95, 108, 120, stats.totalUsers],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Mock data for login activity chart
  const loginActivityData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Logins',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
      },
    ],
  };

  const isLoading = isLoadingUsers || isLoadingActivity;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <UserCheck size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <UserPlus size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">New Users Today</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.newUsersToday}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <LogIn size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Logins</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLogins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">User Growth</h2>
              <div className="h-80">
                <Line 
                  data={userGrowthData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }} 
                />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Login Activity</h2>
              <div className="h-80">
                <Bar 
                  data={loginActivityData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users size={16} className="text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">User {i}</div>
                            <div className="text-sm text-gray-500">user{i}@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {i % 2 === 0 ? 'Logged in' : 'Added new job application'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date().toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;