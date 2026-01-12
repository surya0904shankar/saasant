import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../hooks/useLayout';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import WidgetEditor from './WidgetEditor';
import './dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const {
        widgets,
        saving,
        loading,
        saveLayout,
        addWidget,
        updateWidget,
        removeWidget,
        moveWidget,
        canvasSettings,
        setCanvasSettings
    } = useLayout();

    const [activeWidget, setActiveWidget] = useState(null);
    const [selectedWidgetId, setSelectedWidgetId] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [toast, setToast] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const onRemoveWidgetSelection = (id) => {
        if (selectedWidgetId === id) {
            setSelectedWidgetId(null);
        }
        removeWidget(id);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveWidget(active.data.current);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveWidget(null);

        if (over) {
            const widgetType = active.data.current?.type;
            const isNewWidget = !active.id.startsWith('dropped-');

            if (widgetType && isNewWidget) {
                // Determine the parent (either main-canvas or a container widget/section)
                const isMainCanvas = over.id === 'main-canvas';
                const parentId = isMainCanvas ? null : over.id;

                // Check container limits
                if (parentId) {
                    const parentWidget = widgets.find(w => w.id === parentId);
                    if (parentWidget && parentWidget.type === 'container') {
                        const childCount = widgets.filter(w => w.parentId === parentId).length;
                        if (childCount >= 3) {
                            showToast('Container limit reached (max 3 items)', 'error');
                            return;
                        }
                    }
                }

                const newWidget = {
                    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: widgetType,
                    parentId: parentId,
                    position: {
                        x: 20,
                        y: 20,
                    },
                    props: getDefaultProps(widgetType),
                };
                addWidget(newWidget);
            }
        }
    };

    const getDefaultProps = (type) => {
        const baseProps = {
            background: 'transparent',
            padding: '16px',
            borderRadius: '8px',
        };

        switch (type) {
            case 'typography':
                return {
                    ...baseProps,
                    text: 'Modern Professional Heading',
                    variant: 'h3',
                    color: '#ffffff',
                    background: 'transparent',
                    fontSize: '48px',
                    fontFamily: 'Montserrat, sans-serif',
                    lineHeight: '1.2',
                    letterSpacing: '-0.02em',
                    textAlign: 'center'
                };
            case 'button_mui':
                return {
                    ...baseProps,
                    label: 'Get Started Today',
                    variant: 'contained',
                    color: 'primary',
                    size: 'large',
                    fontSize: '18px',
                    fontFamily: 'Inter, sans-serif',
                    actionType: 'none',
                    actionValue: '',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    letterSpacing: '0.05em'
                };
            case 'list':
                return {
                    ...baseProps,
                    items: ['First Item', 'Second Item', 'Third Item'],
                    listType: 'unordered',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif'
                };
            case 'link':
                return {
                    ...baseProps,
                    text: 'Click Here',
                    url: 'https://example.com',
                    color: '#3b82f6',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'underline'
                };
            case 'textfield':
                return { ...baseProps, label: 'Email Address', value: '', variant: 'outlined', placeholder: 'Enter your email...' };
            case 'image':
                return {
                    ...baseProps,
                    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                    alt: 'Workspace',
                    borderRadius: '12px',
                    width: 400,
                    height: 250
                };
            case 'container':
                return {
                    ...baseProps,
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '24px',
                    borderRadius: '12px',
                    minHeight: '200px'
                };
            case 'section':
                return {
                    ...baseProps,
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '80px 20px',
                    height: 400,
                    borderRadius: '0px'
                };
            default:
                return baseProps;
        }
    };

    const handleSave = async () => {
        const result = await saveLayout();
        if (result.success) {
            showToast('Layout saved successfully! Entering preview mode... ✨', 'success');
            setTimeout(() => setPreviewMode(true), 500); // Shorter delay for better UX
        } else {
            showToast(result.error || 'Failed to save layout', 'error');
        }
    };

    if (loading) {
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

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div
                className={`dashboard ${previewMode ? 'preview-mode' : ''}`}
                style={{ '--canvas-bg': canvasSettings.background }}
            >
                {!previewMode && (
                    <header className="dashboard-header">
                        <div className="header-left">
                            <span className="header-logo">✨ Website Builder</span>
                        </div>
                        <div className="header-right">
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="loading-spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        💾 Save Layout
                                    </>
                                )}
                            </button>
                            {user?.picture && (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="user-avatar"
                                    title={user.name}
                                />
                            )}
                            <button className="logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </header>
                )}

                {previewMode && (
                    <button
                        className="back-to-editor"
                        onClick={() => setPreviewMode(false)}
                    >
                        ✏️ Back to Editor
                    </button>
                )}

                <main className="dashboard-main">
                    {!previewMode && (
                        <Sidebar
                            selectedWidgetId={selectedWidgetId}
                            onSelectWidget={setSelectedWidgetId}
                            widgets={widgets}
                            updateWidget={updateWidget}
                            canvasSettings={canvasSettings}
                            setCanvasSettings={setCanvasSettings}
                        />
                    )}
                    <Canvas
                        widgets={widgets}
                        onUpdateWidget={updateWidget}
                        onRemoveWidget={onRemoveWidgetSelection}
                        onMoveWidget={moveWidget}
                        onSelectWidget={setSelectedWidgetId}
                        selectedWidgetId={selectedWidgetId}
                        previewMode={previewMode}
                    />
                </main>

                {toast && (
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                    </div>
                )}
            </div>

            <DragOverlay>
                {activeWidget ? (
                    <div className="widget-item" style={{ opacity: 0.8 }}>
                        <div className="widget-icon">{activeWidget.icon || '📦'}</div>
                        <div className="widget-info">
                            <div className="widget-name">{activeWidget.name || 'Widget'}</div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext >
    );
};

export default Dashboard;
