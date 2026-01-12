import { useDraggable } from '@dnd-kit/core';

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

export default DraggableWidget;
