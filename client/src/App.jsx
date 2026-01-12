import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/GoogleLogin';
import Dashboard from './components/dashboard/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component - uses Auth0 directly
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, error } = useAuth0();

    console.log('ProtectedRoute state:', { isAuthenticated, isLoading, error });

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0f0f1a'
            }}>
                <div className="loading-spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0f0f1a'
            }}>
                <div className="loading-spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Dashboard />
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={
                        window.location.search.includes('code=') || window.location.search.includes('error=')
                            ? <div style={{ background: '#0f0f1a', height: '100vh' }} />
                            : <Navigate to="/login" replace />
                    } />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
