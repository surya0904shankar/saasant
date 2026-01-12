import { useDraggable } from '@dnd-kit/core';
import WidgetEditor, { GRADIENTS, COLORS } from './WidgetEditor';
import { Box, Typography, Grid, TextField } from '@mui/material';
import { HexColorPicker } from 'react-colorful';

const widgetTypes = [
    {
        type: 'typography',
        name: 'Typography',
        description: 'Text with headings & body styles',
        icon: '🔤',
    },
    {
        type: 'button_mui',
        name: 'MUI Button',
        description: 'Modern Material Button',
        icon: '🔘',
    },
    {
        type: 'image',
        name: 'Image',
        description: 'Visual content',
        icon: '🖼️',
    },
    {
        type: 'textfield',
        name: 'Text Field',
        description: 'Input for text entry',
        icon: '⌨️',
    },
    {
        type: 'select',
        name: 'Select',
        description: 'Dropdown selection menu',
        icon: '🔽',
    },
    {
        type: 'list',
        name: 'List',
        description: 'Bullet/Ordered List',
        icon: '📝',
    },
    {
        type: 'link',
        name: 'Nav Link',
        description: 'Text Link',
        icon: '🔗',
    },
    {
        type: 'container',
        name: 'Container',
        description: 'Drop widgets inside',
        icon: '📦',
    },
    {
        type: 'section',
        name: 'Section',
        description: 'Full-width resizable block',
        icon: '🔲',
    },
    {
        type: 'navbar',
        name: 'Navbar',
        description: 'Navigation Bar',
        icon: '🧭',
    },
];

const DraggableWidget = ({ type, name, description, icon }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: { type, name, icon },
    });

    return (
        <div
            ref={setNodeRef}
            className={`widget-item ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            <div className="widget-icon">{icon}</div>
            <div className="widget-info">
                <div className="widget-name">{name}</div>
                <div className="widget-desc">{description}</div>
            </div>
        </div>
    );
};

const Sidebar = ({
    selectedWidgetId,
    onSelectWidget,
    widgets,
    updateWidget,
    canvasSettings,
    setCanvasSettings
}) => {
    const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

    if (selectedWidget) {
        return (
            <aside className="sidebar">
                <WidgetEditor
                    widget={selectedWidget}
                    onUpdate={(updates) => updateWidget(selectedWidgetId, updates)}
                    onClose={() => onSelectWidget(null)}
                />
            </aside>
        );
    }

    const handleBgChange = (bg) => {
        setCanvasSettings({ ...canvasSettings, background: bg });
        document.documentElement.style.setProperty('--canvas-bg', bg);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">Widgets</h2>
            </div>

            <div className="sidebar-section">
                <Typography variant="overline" sx={{ px: 2, color: 'var(--text-muted)' }}>
                    Add Components
                </Typography>
                <div className="widget-list">
                    {widgetTypes.map((widget) => (
                        <DraggableWidget key={widget.type} {...widget} />
                    ))}
                </div>
            </div>

            <Box sx={{ p: 2, mt: 2, borderTop: '1px solid var(--border-color)' }}>
                <Typography variant="overline" sx={{ color: 'var(--text-muted)' }}>
                    Canvas Background
                </Typography>
                <Grid container gap={1} sx={{ mt: 1 }}>
                    {GRADIENTS.map((g) => (
                        <Box
                            key={g.name}
                            onClick={() => handleBgChange(g.value)}
                            sx={{
                                width: 32,
                                height: 32,
                                background: g.value,
                                border: canvasSettings.background === g.value ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                '&:hover': { transform: 'scale(1.1)' }
                            }}
                            title={g.name}
                        />
                    ))}
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 1, display: 'block' }}>Custom Color</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <HexColorPicker
                            color={canvasSettings.background?.startsWith('#') ? canvasSettings.background : '#0f0f1a'}
                            onChange={handleBgChange}
                            style={{ width: '100%', height: '140px' }}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            value={canvasSettings.background || ''}
                            onChange={(e) => handleBgChange(e.target.value)}
                            placeholder="#0F0F1A"
                            label="Hex Code"
                            InputProps={{
                                sx: { fontFamily: 'monospace', color: '#fff' }
                            }}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </aside>
    );
};

export default Sidebar;
