import { useState, useEffect, useCallback } from 'react';
import { layoutApi, setTokenGetter } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useLayout = () => {
    const [widgets, setWidgets] = useState([]);
    const [canvasSettings, setCanvasSettings] = useState({
        background: '#ffffff',
        headerHeight: '100px',
        footerHeight: '150px'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, getToken } = useAuth();

    // Load layout on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadLayout();
        }
    }, [isAuthenticated]);

    const loadLayout = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await layoutApi.getLayout();
            setWidgets(response.layout?.widgets || []);
            if (response.layout?.canvasSettings) {
                setCanvasSettings(response.layout.canvasSettings);
            }
        } catch (err) {
            console.error('Failed to load layout:', err);
            setError('Failed to load layout');
        } finally {
            setLoading(false);
        }
    };

    const saveLayout = async () => {
        try {
            setSaving(true);
            setError(null);
            await layoutApi.saveLayout({ widgets, canvasSettings });
            return { success: true };
        } catch (err) {
            console.error('Failed to save layout:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to save layout';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setSaving(false);
        }
    };

    const addWidget = useCallback((widget) => {
        setWidgets((prev) => [...prev, widget]);
    }, []);

    const updateWidget = useCallback((id, updates) => {
        setWidgets((prev) =>
            prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
        );
    }, []);

    const removeWidget = useCallback((id) => {
        setWidgets((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const moveWidget = useCallback((id, position) => {
        setWidgets((prev) =>
            prev.map((w) => (w.id === id ? { ...w, position } : w))
        );
    }, []);

    return {
        widgets,
        setWidgets,
        canvasSettings,
        setCanvasSettings,
        loading,
        saving,
        error,
        loadLayout,
        saveLayout,
        addWidget,
        updateWidget,
        removeWidget,
        moveWidget,
    };
};
