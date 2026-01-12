import { useState } from 'react';

const ImageWidget = ({ props, onUpdate }) => {
    const [src, setSrc] = useState(props.src || '');

    const handleUrlChange = (e) => {
        const newSrc = e.target.value;
        setSrc(newSrc);
        onUpdate({ props: { ...props, src: newSrc } });
    };

    return (
        <div className="image-widget">
            {src ? (
                <img src={src} alt={props.alt || 'Widget image'} />
            ) : (
                <div className="image-widget-placeholder">
                    <div className="image-widget-icon">🖼️</div>
                    <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={src}
                        onChange={handleUrlChange}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'var(--text-primary)',
                            width: '100%',
                            fontSize: '13px',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageWidget;
