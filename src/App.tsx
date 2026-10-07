import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Navbar/Layout';

const LoginPage = () => <div className="p-8">Login page (coming soon)</div>;
const RegisterPage = () => <div className="p-8">Register page (coming soon)</div>;
const DashboardPage = () => <div className="p-8">Dashboard (teammate's feature)</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            {/* Layout = navbar on top of every logged-in page */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}