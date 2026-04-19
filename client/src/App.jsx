import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import FolderDetailPage from './pages/FolderDetailPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
    const { session, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!session) return <Navigate to="/auth/login" replace />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<DashboardPage />} />
                        <Route path="folder/:id" element={<FolderDetailPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
