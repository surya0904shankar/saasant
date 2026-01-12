import {
    Button,
    TextField,
    Box,
    Typography,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Switch,
    FormControlLabel,
    Grid,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

export const GRADIENTS = [
    { name: 'None', value: 'transparent' },
    { name: 'Purple Night', value: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f472b6 100%)' },
    { name: 'Ocean Breeze', value: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    { name: 'Emerald', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { name: 'Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
];

export const FONTS = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Montserrat, sans-serif',
    'Playfair Display, serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Poppins, sans-serif',
    'Merriweather, serif',
    'Courier New, monospace',
    'System-ui, sans-serif'
];

export const COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f8fafc' },
    { name: 'Primary', value: '#6366f1' },
    { name: 'Secondary', value: '#f472b6' },
    { name: 'Dark', value: '#1a1a2e' },
];

const WidgetEditor = ({ widget, onUpdate, onClose }) => {
    const [tab, setTab] = useState(0);
    const [props, setProps] = useState(widget?.props || {});

    // Sync local state when widget changes
    useEffect(() => {
        setProps(widget?.props || {});
    }, [widget?.id]);

    if (!widget) return null;

    const handlePropChange = (key, value) => {
        const newProps = { ...props, [key]: value };
        setProps(newProps);
        onUpdate({ props: newProps });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handlePropChange('src', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOptionChange = (idx, value) => {
        const newOptions = [...(props.options || [])];
        newOptions[idx] = value;
        handlePropChange('options', newOptions);
    };

    const addOption = () => {
        const newOptions = [...(props.options || []), 'New Option'];
        handlePropChange('options', newOptions);
    };

    const removeOption = (idx) => {
        const newOptions = (props.options || []).filter((_, i) => i !== idx);
        handlePropChange('options', newOptions);
    };

    const handleListItemChange = (idx, value) => {
        const newItems = [...(props.items || [])];
        newItems[idx] = value;
        handlePropChange('items', newItems);
    };

    const addListItem = () => {
        const newItems = [...(props.items || []), 'New Item'];
        handlePropChange('items', newItems);
    };

    const removeListItem = (idx) => {
        const newItems = (props.items || []).filter((_, i) => i !== idx);
        handlePropChange('items', newItems);
    };

    const renderContentSettings = () => {
        const commonProps = {
            size: "small",
            fullWidth: true,
            sx: {
                mb: 2,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                },
                '& .MuiSelect-select': { color: '#fff' }
            }
        };

        switch (widget.type) {
            case 'typography':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Text Content"
                            multiline
                            rows={3}
                            value={props.text || ''}
                            onChange={(e) => handlePropChange('text', e.target.value)}
                            {...commonProps}
                        />
                        <FormControl {...commonProps}>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={props.fontFamily || FONTS[0]}
                                label="Font Family"
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                            >
                                {FONTS.map(font => (
                                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                        {font.split(',')[0]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Text Size: {props.fontSize || '32px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.fontSize) || 32}
                                min={12}
                                max={120}
                                onChange={(e, val) => handlePropChange('fontSize', `${val}px`)}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Line Height: {props.lineHeight || '1.2'}</Typography>
                            <Slider
                                size="small"
                                value={parseFloat(props.lineHeight) || 1.2}
                                min={0.8}
                                max={2.5}
                                step={0.1}
                                onChange={(e, val) => handlePropChange('lineHeight', val)}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Letter Spacing: {props.letterSpacing || '0em'}</Typography>
                            <Slider
                                size="small"
                                value={parseFloat(props.letterSpacing) || 0}
                                min={-0.1}
                                max={0.5}
                                step={0.01}
                                onChange={(e, val) => handlePropChange('letterSpacing', `${val}em`)}
                            />
                        </Box>
                        <FormControl {...commonProps}>
                            <InputLabel>Alignment</InputLabel>
                            <Select
                                value={props.textAlign || 'left'}
                                label="Alignment"
                                onChange={(e) => handlePropChange('textAlign', e.target.value)}
                            >
                                <MenuItem value="left">Left</MenuItem>
                                <MenuItem value="center">Center</MenuItem>
                                <MenuItem value="right">Right</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl {...commonProps}>
                            <InputLabel>Variant</InputLabel>
                            <Select
                                value={props.variant || 'body1'}
                                label="Variant"
                                onChange={(e) => handlePropChange('variant', e.target.value)}
                            >
                                <MenuItem value="h1">Heading 1</MenuItem>
                                <MenuItem value="h2">Heading 2</MenuItem>
                                <MenuItem value="h3">Heading 3</MenuItem>
                                <MenuItem value="h4">Heading 4</MenuItem>
                                <MenuItem value="body1">Body 1</MenuItem>
                                <MenuItem value="body2">Body 2</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Weight</InputLabel>
                                    <Select
                                        value={props.fontWeight || 'normal'}
                                        label="Weight"
                                        onChange={(e) => handlePropChange('fontWeight', e.target.value)}
                                    >
                                        <MenuItem value="300">Light</MenuItem>
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="600">Semi Bold</MenuItem>
                                        <MenuItem value="bold">Bold</MenuItem>
                                        <MenuItem value="900">Extra Bold</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Style</InputLabel>
                                    <Select
                                        value={props.fontStyle || 'normal'}
                                        label="Style"
                                        onChange={(e) => handlePropChange('fontStyle', e.target.value)}
                                    >
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="italic">Italic</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl {...commonProps}>
                            <InputLabel>Decoration</InputLabel>
                            <Select
                                value={props.textDecoration || 'none'}
                                label="Decoration"
                                onChange={(e) => handlePropChange('textDecoration', e.target.value)}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="underline">Underline</MenuItem>
                                <MenuItem value="line-through">Strikethrough</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 'button_mui':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Label"
                            value={props.label || ''}
                            onChange={(e) => handlePropChange('label', e.target.value)}
                            {...commonProps}
                        />
                        <FormControl {...commonProps}>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={props.fontFamily || FONTS[0]}
                                label="Font Family"
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                            >
                                {FONTS.map(font => (
                                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                        {font.split(',')[0]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Text Size: {props.fontSize || '16px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.fontSize) || 16}
                                min={10}
                                max={60}
                                onChange={(e, val) => handlePropChange('fontSize', `${val}px`)}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Letter Spacing: {props.letterSpacing || '0em'}</Typography>
                            <Slider
                                size="small"
                                value={parseFloat(props.letterSpacing) || 0}
                                min={-0.1}
                                max={0.5}
                                step={0.01}
                                onChange={(e, val) => handlePropChange('letterSpacing', `${val}em`)}
                            />
                        </Box>
                        <Typography variant="overline" sx={{ display: 'block', mb: 1 }}>Actions</Typography>
                        <FormControl {...commonProps}>
                            <InputLabel>Action Type</InputLabel>
                            <Select
                                value={props.actionType || 'none'}
                                label="Action Type"
                                onChange={(e) => handlePropChange('actionType', e.target.value)}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="url">Open URL</MenuItem>
                            </Select>
                        </FormControl>
                        {props.actionType === 'url' && (
                            <TextField
                                label="Website Link (URL)"
                                placeholder="https://example.com"
                                value={props.actionValue || ''}
                                onChange={(e) => handlePropChange('actionValue', e.target.value)}
                                {...commonProps}
                            />
                        )}
                        <FormControl {...commonProps}>
                            <InputLabel>Color Preset</InputLabel>
                            <Select
                                value={props.color || 'primary'}
                                label="Color Preset"
                                onChange={(e) => handlePropChange('color', e.target.value)}
                            >
                                <MenuItem value="primary">Primary</MenuItem>
                                <MenuItem value="secondary">Secondary</MenuItem>
                                <MenuItem value="success">Success</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Weight</InputLabel>
                                    <Select
                                        value={props.fontWeight || 'normal'}
                                        label="Weight"
                                        onChange={(e) => handlePropChange('fontWeight', e.target.value)}
                                    >
                                        <MenuItem value="300">Light</MenuItem>
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="600">Semi Bold</MenuItem>
                                        <MenuItem value="bold">Bold</MenuItem>
                                        <MenuItem value="900">Extra Bold</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Style</InputLabel>
                                    <Select
                                        value={props.fontStyle || 'normal'}
                                        label="Style"
                                        onChange={(e) => handlePropChange('fontStyle', e.target.value)}
                                    >
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="italic">Italic</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl {...commonProps}>
                            <InputLabel>Decoration</InputLabel>
                            <Select
                                value={props.textDecoration || 'none'}
                                label="Decoration"
                                onChange={(e) => handlePropChange('textDecoration', e.target.value)}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="underline">Underline</MenuItem>
                                <MenuItem value="line-through">Strikethrough</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 'image':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Image URL"
                            value={props.src || ''}
                            onChange={(e) => handlePropChange('src', e.target.value)}
                            {...commonProps}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ mb: 2, color: '#fff', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.05)' } }}
                        >
                            Upload from Device
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                        <TextField
                            label="Alt Text"
                            value={props.alt || ''}
                            onChange={(e) => handlePropChange('alt', e.target.value)}
                            {...commonProps}
                        />
                        <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mb: 1 }}>Object Fit</Typography>
                        <FormControl {...commonProps}>
                            <Select
                                value={props.objectFit || 'cover'}
                                onChange={(e) => handlePropChange('objectFit', e.target.value)}
                            >
                                <MenuItem value="cover">Cover</MenuItem>
                                <MenuItem value="contain">Contain</MenuItem>
                                <MenuItem value="fill">Fill</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 'select':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Label"
                            value={props.label || ''}
                            onChange={(e) => handlePropChange('label', e.target.value)}
                            {...commonProps}
                        />
                        <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2, display: 'block' }}>Options</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            {(props.options || ['Option 1', 'Option 2']).map((opt, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' } }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeOption(idx)}
                                        sx={{ minWidth: '40px', px: 0 }}
                                    >
                                        ×
                                    </Button>
                                </Box>
                            ))}
                            <Button variant="dashed" onClick={addOption} sx={{ color: 'var(--primary)', borderColor: 'var(--primary)', borderStyle: 'dashed', borderWidth: 1 }}>
                                + Add Option
                            </Button>
                        </Box>
                    </Box>
                );
            case 'textfield':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Label"
                            value={props.label || ''}
                            onChange={(e) => handlePropChange('label', e.target.value)}
                            {...commonProps}
                        />
                        <TextField
                            label="Placeholder"
                            value={props.placeholder || ''}
                            onChange={(e) => handlePropChange('placeholder', e.target.value)}
                            {...commonProps}
                        />
                        <FormControl {...commonProps}>
                            <InputLabel>Input Type</InputLabel>
                            <Select
                                value={props.inputType || 'text'}
                                label="Input Type"
                                onChange={(e) => handlePropChange('inputType', e.target.value)}
                            >
                                <MenuItem value="text">Text</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="password">Password</MenuItem>
                                <MenuItem value="number">Number</MenuItem>
                                <MenuItem value="tel">Telephone</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 'section':
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Section Settings</Typography>
                        <Box sx={{ mb: 2, mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#fff' }}>Height: {props.height || 400}px</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.height) || 400}
                                min={100}
                                max={1200}
                                onChange={(e, val) => handlePropChange('height', val)}
                                sx={{ color: 'var(--primary)' }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 2 }}>
                            Sections are full-width containers that stack vertically. You can change their height and background colors in the Style tab.
                        </Typography>
                    </Box>
                );
            case 'list':
                return (
                    <Box sx={{ p: 2 }}>
                        <FormControl {...commonProps}>
                            <InputLabel>List Type</InputLabel>
                            <Select
                                value={props.listType || 'unordered'}
                                label="List Type"
                                onChange={(e) => handlePropChange('listType', e.target.value)}
                            >
                                <MenuItem value="unordered">Bulleted (Unordered)</MenuItem>
                                <MenuItem value="ordered">Numbered (Ordered)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl {...commonProps}>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={props.fontFamily || FONTS[0]}
                                label="Font Family"
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                            >
                                {FONTS.map(font => (
                                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                        {font.split(',')[0]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Text Size: {props.fontSize || '16px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.fontSize) || 16}
                                min={12}
                                max={48}
                                onChange={(e, val) => handlePropChange('fontSize', `${val}px`)}
                            />
                        </Box>
                        <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2, display: 'block' }}>List Items</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            {(props.items || ['Item 1', 'Item 2']).map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={item}
                                        onChange={(e) => handleListItemChange(idx, e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' } }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeListItem(idx)}
                                        sx={{ minWidth: '40px', px: 0 }}
                                    >
                                        ×
                                    </Button>
                                </Box>
                            ))}
                            <Button variant="dashed" onClick={addListItem} sx={{ color: 'var(--primary)', borderColor: 'var(--primary)', borderStyle: 'dashed', borderWidth: 1 }}>
                                + Add Item
                            </Button>
                        </Box>
                    </Box>
                );
            case 'link':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Link Text"
                            value={props.text || ''}
                            onChange={(e) => handlePropChange('text', e.target.value)}
                            {...commonProps}
                        />
                        <TextField
                            label="URL"
                            value={props.url || ''}
                            onChange={(e) => handlePropChange('url', e.target.value)}
                            {...commonProps}
                        />
                        <FormControl {...commonProps}>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={props.fontFamily || FONTS[0]}
                                label="Font Family"
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                            >
                                {FONTS.map(font => (
                                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                        {font.split(',')[0]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Text Size: {props.fontSize || '16px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.fontSize) || 16}
                                min={12}
                                max={48}
                                onChange={(e, val) => handlePropChange('fontSize', `${val}px`)}
                            />
                        </Box>
                        <FormControl {...commonProps}>
                            <InputLabel>Decoration</InputLabel>
                            <Select
                                value={props.textDecoration || 'underline'}
                                label="Decoration"
                                onChange={(e) => handlePropChange('textDecoration', e.target.value)}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="underline">Underline</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            default:
                return <Box sx={{ p: 2 }}><Typography variant="body2" color="textSecondary">No custom settings</Typography></Box>;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'var(--bg-card)' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', gap: 1 }}>
                <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-secondary)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Edit {widget.type.split('_')[0]}
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
                    <Tab label="Content" sx={{ minWidth: 0 }} />
                    <Tab label="Style" sx={{ minWidth: 0 }} />
                </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {tab === 0 && renderContentSettings()}

                {tab === 1 && (
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Background</Typography>
                            <Grid container gap={1} sx={{ mt: 1 }}>
                                {GRADIENTS.map((g) => (
                                    <Box
                                        key={g.name}
                                        onClick={() => handlePropChange('background', g.value)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            background: g.value,
                                            border: props.background === g.value ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                        title={g.name}
                                    />
                                ))}
                                {COLORS.map((c) => (
                                    <Box
                                        key={c.name}
                                        onClick={() => handlePropChange('background', c.value)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: c.value,
                                            border: props.background === c.value ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                        title={c.name}
                                    />
                                ))}
                            </Grid>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" sx={{ color: 'var(--text-muted)', mb: 1, display: 'block' }}>Custom Color</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <HexColorPicker
                                        color={props.background?.startsWith('#') ? props.background : '#6366f1'}
                                        onChange={(color) => handlePropChange('background', color)}
                                        style={{ width: '100%', height: '140px' }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {(widget.type === 'typography' || widget.type === 'button_mui' || widget.type === 'list' || widget.type === 'link') && (
                            <Box>
                                <Typography variant="overline" sx={{ color: 'var(--text-muted)' }}>Text Color</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <HexColorPicker
                                            color={props.textColor || '#ffffff'}
                                            onChange={(color) => handlePropChange('textColor', color)}
                                            style={{ width: '100%', height: '140px' }}
                                        />
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={props.textColor || ''}
                                            onChange={(e) => handlePropChange('textColor', e.target.value)}
                                            placeholder="#FFFFFF"
                                            label="Hex Code"
                                            InputProps={{
                                                sx: { fontFamily: 'monospace' }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        <Box>
                            <Typography variant="overline" sx={{ color: 'var(--text-muted)', display: 'block' }}>Padding: {props.padding || '16px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.padding) || 16}
                                min={0}
                                max={64}
                                onChange={(e, val) => handlePropChange('padding', `${val}px`)}
                            />
                        </Box>

                        <Box>
                            <Typography variant="overline" sx={{ color: 'var(--text-muted)', display: 'block' }}>Corner Radius: {props.borderRadius || '8px'}</Typography>
                            <Slider
                                size="small"
                                value={parseInt(props.borderRadius) || 0}
                                min={0}
                                max={50}
                                onChange={(e, val) => handlePropChange('borderRadius', `${val}px`)}
                            />
                        </Box>

                        <Box>
                            <Typography variant="overline" sx={{ color: 'var(--text-muted)', display: 'block' }}>Shadow</Typography>
                            <Grid container gap={1} sx={{ mt: 1 }}>
                                {[
                                    { name: 'None', value: 'none' },
                                    { name: 'Soft', value: '0 4px 12px rgba(0,0,0,0.1)' },
                                    { name: 'Medium', value: '0 8px 24px rgba(0,0,0,0.2)' },
                                    { name: 'Strong', value: '0 12px 48px rgba(0,0,0,0.3)' },
                                ].map((s) => (
                                    <Button
                                        key={s.name}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handlePropChange('boxShadow', s.value)}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1,
                                            borderColor: props.boxShadow === s.value ? 'var(--primary)' : 'divider',
                                            color: props.boxShadow === s.value ? 'var(--primary)' : 'inherit'
                                        }}
                                    >
                                        {s.name}
                                    </Button>
                                ))}
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>Border</Typography>
                            <Grid container gap={1} sx={{ mt: 1 }}>
                                {[
                                    { name: 'None', value: 'none' },
                                    { name: 'Thin', value: '1px solid rgba(255,255,255,0.1)' },
                                    { name: 'White', value: '1px solid #ffffff' },
                                    { name: 'Primary', value: '2px solid var(--primary)' },
                                ].map((b) => (
                                    <Button
                                        key={b.name}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handlePropChange('border', b.value)}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1,
                                            borderColor: props.border === b.value ? 'var(--primary)' : 'divider',
                                            color: props.border === b.value ? 'var(--primary)' : 'inherit'
                                        }}
                                    >
                                        {b.name}
                                    </Button>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid var(--border-color)' }}>
                <Button fullWidth variant="contained" onClick={onClose}>
                    Done
                </Button>
            </Box>
        </Box>
    );
};

export default WidgetEditor;
