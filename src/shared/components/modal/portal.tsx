import React from 'react';
import ReactDOM from 'react-dom';

export interface PortalProps {
    children: React.ReactNode;
    className: string;
}

export default function Portal({ children, className } : PortalProps) {
    const el = React.useMemo(() => document.createElement("div"), []);
    React.useEffect(() => {
        const classList: string[] = ["w-full", "h-full", "flex", "items-center", "top-0", "right-0", "left-0", "bottom-0", "absolute", "justify-center"];
        if (className) className.split(" ").forEach((item) => classList.push(item));
        classList.forEach((item) => el.classList.add(item));
        document.body.appendChild(el);
        return () => {
            document.body.removeChild(el);
        };
    }, [el, className]);
    return ReactDOM.createPortal(children, el);
}
