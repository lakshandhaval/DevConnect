import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobForm from './pages/admin/AdminJobForm';
import AdminJobApplicants from './pages/admin/AdminJobApplicants';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e35',
              color: '#f3f4f6',
              border: '1px solid #252542',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route index element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobListing />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected — any authenticated user */}
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute><MyApplications /></ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute><SavedJobs /></ProtectedRoute>
            } />

            {/* Admin-only */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/jobs/new" element={
              <ProtectedRoute requireAdmin><AdminJobForm /></ProtectedRoute>
            } />
            <Route path="/admin/jobs/:id/edit" element={
              <ProtectedRoute requireAdmin><AdminJobForm /></ProtectedRoute>
            } />
            <Route path="/admin/jobs/:jobId/applications" element={
              <ProtectedRoute requireAdmin><AdminJobApplicants /></ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
