import { createContext, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenGetter } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const {
        user,
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout: auth0Logout,
        getAccessTokenSilently,
    } = useAuth0();

    // Set token getter as soon as we have the Auth0 function
    useEffect(() => {
        setTokenGetter(getAccessTokenSilently);
    }, [getAccessTokenSilently]);

    const login = () => {
        loginWithRedirect();
    };

    const logout = () => {
        auth0Logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };

    const getToken = async () => {
        try {
            const token = await getAccessTokenSilently();
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    };

    const value = {
        user: user ? {
            email: user.email,
            name: user.name,
            picture: user.picture,
            sub: user.sub,
        } : null,
        loading: isLoading,
        isAuthenticated,
        login,
        logout,
        getToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
