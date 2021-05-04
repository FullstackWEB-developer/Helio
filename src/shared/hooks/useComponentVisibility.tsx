import {useEffect, useRef, useState} from 'react';

const useComponentVisibility = <T extends HTMLElement>(defaultVisibility: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>, React.RefObject<T>] => {
    const [isVisible, setIsVisible] = useState(defaultVisibility);
    const elementRef = useRef<T>(null);

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsVisible(false);
        }
    }

    const clickOutsideHandler = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as any)) {
            setIsVisible(false);
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler, true);
        document.addEventListener('click', clickOutsideHandler, true);
        return () => {
            document.removeEventListener('keydown', keydownHandler, true);
            document.removeEventListener('click', clickOutsideHandler, true);
        };
    });

    return [isVisible, setIsVisible, elementRef];
}

export default useComponentVisibility;