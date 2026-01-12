import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';

const SectionWidget = ({ id, props, children, previewMode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        minHeight: `${props.height || 300}px`,
        width: '100%',
        background: props.background || 'rgba(255, 255, 255, 0.02)',
        padding: props.padding || '60px 20px',
        position: 'relative',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderBottom: previewMode ? 'none' : '1px dashed rgba(255, 255, 255, 0.1)',
        '&::after': isOver && !previewMode ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid var(--primary)',
            pointerEvents: 'none',
            zIndex: 1
        } : {}
    };

    return (
        <Box
            ref={setNodeRef}
            sx={style}
            className={`section-widget ${isOver ? 'drag-over' : ''}`}
        >
            {!previewMode && children.length === 0 && (
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.2)',
                        fontWeight: 300,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em'
                    }}
                >
                    Empty Section
                </Typography>
            )}
            {children}
        </Box>
    );
};

export default SectionWidget;
