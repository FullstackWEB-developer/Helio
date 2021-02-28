import { RefObject, useEffect } from 'react';

const useOutsideClick = (refs: RefObject<HTMLDivElement>[], callback: Function) => {
    const handleClick = (e: any) => {
        if (refs.every(ref => ref.current && !ref.current.contains(e.target))) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

const customHooks = { useOutsideClick };

export default customHooks;
