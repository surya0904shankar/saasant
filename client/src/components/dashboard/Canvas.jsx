import { useDroppable } from '@dnd-kit/core';
import DroppedWidget from '../widgets/DroppedWidget';

const Canvas = ({
    widgets,
    onUpdateWidget = () => { },
    onRemoveWidget = () => { },
    onMoveWidget = () => { },
    onSelectWidget = () => { },
    selectedWidgetId,
    previewMode
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'main-canvas',
    });

    // Only show widgets that don't have a parentId at the top level
    const topLevelWidgets = widgets.filter(w => !w.parentId);

    return (
        <div className={`canvas-container ${previewMode ? 'preview' : ''}`}>
            <div
                ref={setNodeRef}
                className={`canvas ${isOver ? 'drag-over' : ''}`}
                style={{
                    minHeight: '100vh',
                    position: 'relative',
                    width: '100%',
                    background: 'var(--canvas-bg)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0px' // Sections will be stacked
                }}
            >
                {topLevelWidgets.length === 0 && !previewMode && (
                    <div className="canvas-placeholder" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
                        <p>Drop sections or widgets here to start building your page</p>
                    </div>
                )}
                {topLevelWidgets.map((widget) => (
                    <DroppedWidget
                        key={widget.id}
                        widget={widget}
                        onUpdate={onUpdateWidget}
                        onRemove={onRemoveWidget}
                        onMove={onMoveWidget}
                        onSelect={onSelectWidget}
                        selectedWidgetId={selectedWidgetId}
                        previewMode={previewMode}
                        allWidgets={widgets}
                    />
                ))}
            </div>
        </div>
    );
};

export default Canvas;
