import React from 'react';

const LinkWidget = ({ text, url, color, fontFamily, fontSize, textDecoration }) => {
    return (
        <a
            href={url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                color: color || '#3b82f6',
                fontFamily: fontFamily || 'inherit',
                fontSize: fontSize || '1rem',
                textDecoration: textDecoration || 'underline',
                cursor: 'pointer'
            }}
            onClick={(e) => {
                // In editor mode, we might want to prevent default navigation
                // But for simplicity, we let it be 
                // e.preventDefault(); 
            }}
        >
            {text || 'Link Text'}
        </a>
    );
};

export default LinkWidget;
