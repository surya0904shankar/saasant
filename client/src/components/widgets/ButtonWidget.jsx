import { useState, useEffect } from 'react';

const ButtonWidget = ({ props, onUpdate }) => {
    const [label, setLabel] = useState(props.label || 'Click Me');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLabel(props.label || 'Click Me');
    }, [props.label]);

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onUpdate({ props: { ...props, label } });
    };

    const handleChange = (e) => {
        setLabel(e.target.value);
    };

    return (
        <div className="button-widget" onMouseDown={(e) => e.stopPropagation()}>
            {isEditing ? (
                <input
                    type="text"
                    value={label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    style={{
                        padding: '12px 24px',
                        background: 'var(--bg-elevated)',
                        border: '2px solid var(--primary)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                />
            ) : (
                <button
                    className="button-widget-btn"
                    onDoubleClick={handleDoubleClick}
                >
                    {label}
                </button>
            )}
        </div>
    );
};

export default ButtonWidget;
