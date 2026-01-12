import { useState, useEffect, useRef } from 'react';
import ListWidget from './ListWidget';
import LinkWidget from './LinkWidget';
import ContainerWidget from './ContainerWidget';
import SectionWidget from './SectionWidget';
import {
    Typography,
    Button as MuiButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';

const DroppedWidget = ({ widget, onUpdate, onRemove, onMove, onSelect, selectedWidgetId, previewMode, allWidgets }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(widget.position);
    const [size, setSize] = useState(widget.size || { width: 'auto', height: 'auto' });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);
    const widgetRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const initialResize = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

    // Derived state
    const isSelected = selectedWidgetId === widget?.id;

    useEffect(() => {
        setPosition(widget.position);
    }, [widget.position]);

    useEffect(() => {
        if (widget.size) setSize(widget.size);
    }, [widget.size]);

    const handleMouseDown = (e) => {
        if (previewMode) return;
        if (e.target.closest('.widget-delete-btn')) return;

        const resizeHandle = e.target.closest('.resize-handle');
        if (resizeHandle) {
            setIsResizing(true);
            const dir = resizeHandle.classList.contains('nw') ? 'nw' :
                resizeHandle.classList.contains('ne') ? 'ne' :
                    resizeHandle.classList.contains('sw') ? 'sw' : 'se';
            setResizeDir(dir);

            const rect = widgetRef.current.getBoundingClientRect();
            initialResize.current = {
                x: e.clientX,
                y: e.clientY,
                width: rect.width,
                height: rect.height,
                left: position.x,
                top: position.y
            };
            e.stopPropagation();
            return;
        }

        e.stopPropagation(); // Prevent DndContext from interfering with custom drag
        onSelect(widget.id); // Select for editing

        setIsDragging(true);
        const rect = widgetRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            const dx = e.clientX - initialResize.current.x;
            const dy = e.clientY - initialResize.current.y;

            let newWidth = initialResize.current.width;
            let newHeight = initialResize.current.height;
            let newX = initialResize.current.left;
            let newY = initialResize.current.top;

            if (resizeDir.includes('e')) newWidth = initialResize.current.width + dx;
            if (resizeDir.includes('w')) {
                newWidth = initialResize.current.width - dx;
                newX = initialResize.current.left + dx;
            }
            if (resizeDir.includes('s')) newHeight = initialResize.current.height + dy;
            if (resizeDir.includes('n')) {
                newHeight = initialResize.current.height - dy;
                newY = initialResize.current.top + dy;
            }

            const minSize = 50;
            if (newWidth >= minSize) {
                setSize(s => ({ ...s, width: newWidth }));
                setPosition(p => ({ ...p, x: newX }));
            }
            if (newHeight >= minSize) {
                setSize(s => ({ ...s, height: newHeight }));
                setPosition(p => ({ ...p, y: newY }));
            }
            return;
        }

        if (!isDragging) return;

        const parent = widgetRef.current.parentElement;
        const parentRect = parent.getBoundingClientRect();

        const newX = e.clientX - parentRect.left - dragOffset.current.x;
        const newY = e.clientY - parentRect.top - dragOffset.current.y;

        setPosition({
            x: Math.max(0, newX),
            y: Math.max(0, newY),
        });
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            onMove(widget.id, position);
        }
        if (isResizing) {
            setIsResizing(false);
            setResizeDir(null);
            onUpdate(widget.id, { size, position });
        }
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, position, size, resizeDir]);

    const renderWidget = () => {
        const { type, props = {} } = widget || {};
        const isSection = type === 'section';
        // isSelected is defined in component scope
        const style = {
            background: isSection ? 'transparent' : (props?.background || 'transparent'),
            padding: props?.padding || '0px',
            borderRadius: props?.borderRadius || '0px',
            width: isSection ? '100%' : (size.width === 'auto' ? 'auto' : (typeof size.width === 'number' ? `${size.width}px` : size.width)),
            height: size.height === 'auto' ? 'auto' : (typeof size.height === 'number' ? `${size.height}px` : size.height),
            fontFamily: props?.fontFamily || 'inherit',
            fontSize: props?.fontSize || 'inherit',
            fontSize: props?.fontSize || 'inherit',
            color: props?.textColor || 'inherit',
            // Default to black color for text-based widgets if not specified, unless it's a section/container
            color: props?.color || props?.textColor || (['typography', 'text', 'textfield', 'select', 'button_mui', 'list', 'link'].includes(type) ? 'var(--text-primary)' : 'inherit'),
            backdropFilter: props?.backdropFilter || 'none',
            backdropFilter: props?.backdropFilter || 'none',
            border: props?.border || 'none',
            textAlign: props?.textAlign || 'left',
            boxShadow: props?.boxShadow || 'none',
            boxSizing: 'border-box',
            transition: isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: isDragging || isResizing || isSelected ? 1000 : (isSection ? 1 : 10),
            pointerEvents: 'auto',
            border: isSelected && !previewMode ? '2px solid var(--primary)' : (props?.border || 'none'),
        };

        const wrap = (content) => (
            <Box sx={style}>{content}</Box>
        );

        switch (type) {
            case 'container':
                const childrenWidgets = allWidgets?.filter(w => w.parentId === widget.id) || [];
                return wrap(
                    <ContainerWidget
                        id={widget.id}
                        props={props}
                        onUpdate={(updates) => onUpdate(widget.id, updates)}
                        previewMode={previewMode}
                    >
                        {childrenWidgets.map(child => (
                            <DroppedWidget
                                key={child.id}
                                widget={child}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                                onMove={onMove}
                                onSelect={onSelect}
                                selectedWidgetId={selectedWidgetId}
                                previewMode={previewMode}
                                allWidgets={allWidgets}
                            />
                        ))}
                    </ContainerWidget>
                );
            case 'section':
                const sectionChildren = allWidgets?.filter(w => w.parentId === widget.id) || [];
                return wrap(
                    <SectionWidget
                        id={widget.id}
                        props={props}
                        previewMode={previewMode}
                    >
                        {sectionChildren.map(child => (
                            <DroppedWidget
                                key={child.id}
                                widget={child}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                                onMove={onMove}
                                onSelect={onSelect}
                                selectedWidgetId={selectedWidgetId}
                                previewMode={previewMode}
                                allWidgets={allWidgets}
                            />
                        ))}
                    </SectionWidget>
                );
            case 'typography':
                return wrap(
                    <Typography
                        variant={props.variant || 'body1'}
                        sx={{
                            fontFamily: props.fontFamily,
                            fontSize: props.fontSize,
                            fontWeight: props.fontWeight || 'normal',
                            fontStyle: props.fontStyle || 'normal',
                            textDecoration: props.textDecoration || 'none',
                            color: props.textColor || props.color || 'inherit',
                            lineHeight: props.lineHeight || 'normal',
                            letterSpacing: props.letterSpacing || 'normal',
                            textAlign: props.textAlign || 'inherit'
                        }}
                    >
                        {props.text || 'Typography'}
                    </Typography>
                );
            case 'button_mui':
                return wrap(
                    <MuiButton
                        variant={props.variant || 'contained'}
                        color={props.color || 'primary'}
                        size={props.size || 'medium'}
                        sx={{
                            fontFamily: props.fontFamily,
                            fontSize: props.fontSize,
                            fontWeight: props.fontWeight || 'normal',
                            fontStyle: props.fontStyle || 'normal',
                            textDecoration: props.textDecoration || 'none',
                            textTransform: 'none',
                            color: props.textColor || (props.variant === 'contained' ? '#ffffff' : 'primary'),
                            backgroundColor: props.background,
                            '&:hover': {
                                backgroundColor: props.background, // Maintain custom color on hover for now
                                opacity: 0.9
                            },
                            padding: props.padding,
                            borderRadius: props.borderRadius,
                            letterSpacing: props.letterSpacing || 'normal',
                            width: '100%',
                            height: '100%',
                        }}
                        onClick={() => {
                            if (previewMode && props.actionType === 'url' && props.actionValue) {
                                const url = props.actionValue.startsWith('http') ? props.actionValue : `https://${props.actionValue}`;
                                window.open(url, '_blank');
                            }
                        }}
                    >
                        {props.label || 'Button'}
                    </MuiButton>
                );
            case 'image':
                return wrap(
                    <Box
                        component="img"
                        src={props.src || 'https://via.placeholder.com/400x250'}
                        alt={props.alt || 'Widget'}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: props.objectFit || 'cover',
                            borderRadius: props.borderRadius,
                            display: 'block'
                        }}
                    />
                );
            case 'textfield':
                return wrap(
                    <TextField
                        label={props.label || 'Text Field'}
                        placeholder={props.placeholder || ''}
                        type={props.inputType || 'text'}
                        variant={props.variant || 'outlined'}
                        fullWidth
                        InputProps={{
                            readOnly: true, // Prevent typing during edit mode
                        }}
                    />
                );
            case 'list':
                return wrap(
                    <ListWidget
                        items={props.items}
                        type={props.listType}
                        color={props.textColor || props.color}
                        fontFamily={props.fontFamily}
                        fontSize={props.fontSize}
                    />
                );
            case 'link':
                return wrap(
                    <LinkWidget
                        text={props.text}
                        url={props.url}
                        color={props.textColor || props.color}
                        fontFamily={props.fontFamily}
                        fontSize={props.fontSize}
                    />
                );
            case 'select':
                return wrap(
                    <FormControl fullWidth variant={props.variant || 'outlined'}>
                        <InputLabel>{props.label || 'Select'}</InputLabel>
                        <Select
                            label={props.label || 'Select'}
                            value=""
                            readOnly
                            MenuProps={{ style: { zIndex: 99999 } }}
                        >
                            {(props.options || ['Option 1', 'Option 2']).map((opt, idx) => (
                                <MenuItem key={idx} value={opt}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            default:
                return wrap(<Box sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unknown widget type: {type}</Box>);
        }
    };

    return (
        <div
            ref={widgetRef}
            className={`dropped-widget ${isDragging ? 'selected' : ''} ${previewMode ? 'preview' : ''} ${widget.type}-type`}
            style={{
                left: widget.type === 'section' ? 0 : position.x,
                top: position.y,
                width: widget.type === 'section' ? '100%' : 'auto',
                cursor: previewMode ? 'default' : (isDragging ? 'grabbing' : 'grab'),
                padding: 0,
                position: widget.type === 'section' ? 'relative' : 'absolute',
                zIndex: isDragging || isResizing || isSelected ? 1000 : (widget.type === 'section' ? 1 : 10),
            }}
            onMouseDown={handleMouseDown}
        >
            {!previewMode && (
                <button className="widget-delete-btn" onClick={(e) => {
                    e.stopPropagation();
                    onRemove(widget.id);
                }}>
                    ×
                </button>
            )}
            {renderWidget()}
            {!previewMode && (
                <>
                    <div className="resize-handle nw" />
                    <div className="resize-handle ne" />
                    <div className="resize-handle sw" />
                    <div className="resize-handle se" />
                </>
            )}
        </div>
    );
};

export default DroppedWidget;
