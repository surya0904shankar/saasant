import { useState, useEffect } from 'react';

const TextWidget = ({ props, onUpdate }) => {
    const [content, setContent] = useState(props.content || 'Edit this text...');

    useEffect(() => {
        setContent(props.content || 'Edit this text...');
    }, [props.content]);

    const handleBlur = (e) => {
        const newContent = e.target.innerText;
        setContent(newContent);
        onUpdate({ props: { ...props, content: newContent } });
    };

    return (
        <div className="text-widget">
            <div
                className="text-widget-content"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </div>
    );
};

export default TextWidget;
