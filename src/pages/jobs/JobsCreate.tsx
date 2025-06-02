import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Briefcase, Calendar, Building, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobFormData {
  position: string;
  company: string;
  link: string;
  date: string;
  status: string;
  notes?: string;
}

const JobsCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today
      status: 'applied',
    },
  });

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, data);
      toast.success('Job application added successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to add job application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Job Application</h1>
      </div>

      <motion.div 
        className="card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="position" className="form-label">
                Position <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Briefcase size={18} className="text-gray-400" />
                </div>
                <input
                  id="position"
                  type="text"
                  className={`form-input pl-10 ${errors.position ? 'border-red-500' : ''}`}
                  placeholder="e.g., Frontend Developer"
                  {...register('position', {
                    required: 'Position is required',
                  })}
                />
              </div>
              {errors.position && (
                <p className="error-message">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="form-label">
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building size={18} className="text-gray-400" />
                </div>
                <input
                  id="company"
                  type="text"
                  className={`form-input pl-10 ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="e.g., Acme Inc."
                  {...register('company', {
                    required: 'Company is required',
                  })}
                />
              </div>
              {errors.company && (
                <p className="error-message">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="link" className="form-label">
                Job Link <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LinkIcon size={18} className="text-gray-400" />
                </div>
                <input
                  id="link"
                  type="url"
                  className={`form-input pl-10 ${errors.link ? 'border-red-500' : ''}`}
                  placeholder="https://example.com/job"
                  {...register('link', {
                    required: 'Job link is required',
                    pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message: 'Enter a valid URL',
                    },
                  })}
                />
              </div>
              {errors.link && (
                <p className="error-message">{errors.link.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="form-label">
                Application Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  className={`form-input pl-10 ${errors.date ? 'border-red-500' : ''}`}
                  {...register('date', {
                    required: 'Application date is required',
                  })}
                />
              </div>
              {errors.date && (
                <p className="error-message">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-input"
              {...register('status')}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              className="form-input"
              placeholder="Any additional notes about this application"
              {...register('notes')}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Save Job Application'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default JobsCreate;