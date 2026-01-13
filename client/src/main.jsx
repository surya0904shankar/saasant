import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId) {
    const errorMsg = `CRITICAL ERROR: Auth0 environment variables are missing! 
    Domain: ${domain ? '✅' : '❌ MISSING'}
    ClientID: ${clientId ? '✅' : '❌ MISSING'}
    Please check your Vercel Project Settings > Environment Variables.`;
    console.error(errorMsg);
    // Only alert in production to catch deployment issues
    if (import.meta.env.PROD) {
        alert(errorMsg);
    }
}

// Handle redirect callback - navigate to dashboard after login
const onRedirectCallback = (appState) => {
    console.log('Auth0 Redirect Callback triggered', { appState });
    window.history.replaceState(
        {},
        document.title,
        appState?.returnTo || '/dashboard'
    );
    console.log('Navigating to dashboard via hard reload...');
    // Force reload to ensure auth state is picked up
    window.location.href = '/dashboard';
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: audience,
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation="localstorage"
            useRefreshTokens={true}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
)
