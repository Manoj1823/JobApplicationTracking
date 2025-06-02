import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  FileDown, 
  BarChart3, 
  PlusCircle
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface JobApplication {
  _id: string;
  position: string;
  company: string;
  link: string;
  date: string;
  status?: string;
}

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800',
};

const Dashboard = () => {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
      return response.data;
    },
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    if (jobs.length > 0) {
      const newStats = {
        total: jobs.length,
        applied: jobs.filter((job: JobApplication) => job.status === 'applied').length,
        interview: jobs.filter((job: JobApplication) => job.status === 'interview').length,
        offer: jobs.filter((job: JobApplication) => job.status === 'offer').length,
        rejected: jobs.filter((job: JobApplication) => job.status === 'rejected').length,
        pending: jobs.filter((job: JobApplication) => !job.status || job.status === 'pending').length,
      };
      setStats(newStats);
    }
  }, [jobs]);

  // Chart data
  const pieData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [stats.applied, stats.interview, stats.offer, stats.rejected, stats.pending],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(156, 163, 175, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Monthly applications data
  const currentMonth = new Date().getMonth();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return monthNames[monthIndex];
  }).reverse();
  
  const barData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Applications',
        data: [5, 8, 12, 7, 10, stats.total], // Mock data for previous months
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/jobs/create"
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <PlusCircle size={18} className="mr-2" />
          Add new job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Briefcase size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Interviews</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.interview}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Offers</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.offer}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <BarChart3 size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total > 0 ? `${Math.round((stats.offer / stats.total) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Application Status</h2>
          <div className="h-64">
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Applications</h2>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <Link
            to="/jobs"
            className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 sm:mt-0"
          >
            View all
            <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase size={48} className="text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No job applications yet</h3>
              <p className="text-gray-500">Add your first job application to get started</p>
              <Link
                to="/jobs/create"
                className="btn btn-primary mt-4"
              >
                <PlusCircle size={18} className="mr-2" />
                Add new job
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {jobs.slice(0, 5).map((job: JobApplication) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{job.position}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{job.company}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(job.date), { addSuffix: true })}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[job.status as keyof typeof statusColors] || statusColors.pending
                        }`}>
                          {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
        <p className="mt-2 text-gray-600">Download your job application data in various formats</p>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            type="button"
            className="btn btn-secondary"
          >
            <FileDown size={18} className="mr-2" />
            Export as PDF
          </button>
          <button
            type="button"
            className="btn btn-secondary"
          >
            <FileDown size={18} className="mr-2" />
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;