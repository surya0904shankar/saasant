import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';

const ContainerWidget = ({ id, props, children, onUpdate, previewMode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        minHeight: props.minHeight || '40px',
        width: '100%',
        border: previewMode ? 'none' : (isOver ? '2px solid var(--primary)' : '1px dashed var(--border-color)'),
        borderRadius: props.borderRadius || '8px',
        background: props.background || 'rgba(255, 255, 255, 0.02)',
        padding: props.padding || '0px',
        position: 'relative',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
    };

    return (
        <Box
            ref={setNodeRef}
            sx={style}
            className={`container-widget ${isOver ? 'drag-over' : ''}`}
        >
            {!previewMode && children.length === 0 && (
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none'
                    }}
                >
                    Drop components here
                </Typography>
            )}
            {children}
        </Box>
    );
};

export default ContainerWidget;
