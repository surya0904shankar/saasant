import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
    const { loginWithRedirect, isLoading } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">✨</div>
                <h1 className="login-title">Website Builder</h1>
                <p className="login-subtitle">
                    Create stunning, professional websites with our intuitive drag-and-drop builder.
                    No coding required.
                </p>

                <div className="google-btn-wrapper">
                    <button
                        className="auth0-login-btn"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner" />
                        ) : (
                            <>
                                🔐 Continue with Auth0
                            </>
                        )}
                    </button>
                </div>

                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">🎨</div>
                        <div className="feature-text">Drag & Drop</div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">☁️</div>
                        <div className="feature-text">Cloud Save</div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <div className="feature-text">Fast & Easy</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
