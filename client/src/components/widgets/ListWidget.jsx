import React from 'react';
import { Box } from '@mui/material';

const ListWidget = ({ items, type = 'unordered', color, fontFamily, fontSize }) => {
    const Component = type === 'ordered' ? 'ol' : 'ul';

    return (
        <Component style={{
            color: color || 'var(--text-primary)',
            fontFamily: fontFamily || 'inherit',
            fontSize: fontSize || '1rem',
            margin: 0,
            paddingLeft: '20px'
        }}>
            {(items || ['List Item 1', 'List Item 2', 'List Item 3']).map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                    {item}
                </li>
            ))}
        </Component>
    );
};

export default ListWidget;
