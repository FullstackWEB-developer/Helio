import {useEffect, useRef} from "react";

const AlwaysScrollToBottom = ({enabled}: {enabled?: boolean}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enabled && elementRef.current) {
            elementRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            })
        }
    }, [enabled]);

    return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
