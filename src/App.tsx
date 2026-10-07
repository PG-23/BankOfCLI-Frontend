import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Navbar/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { DepositSection } from './components/deposit';

const DashboardPage = () => (
  <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8">
    <p>Dashboard (teammate's feature)</p>
    <DepositSection />
  </div>
);

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
              <Route path="/dashboard" element={<DashboardPage />} />            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}
