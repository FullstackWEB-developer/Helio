import { Ref, RefObject, useEffect, useRef } from 'react';

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

function useCombinedForwardAndInnerRef<T>(forwardedRef: Ref<T>) {
    // final ref that will share value with forward ref. this is the one we will attach to components
    const innerRef = useRef<T>(null);
    useEffect(() => {
        // after every render - try to share current ref value with forwarded ref
        if (!forwardedRef) {
            return;
        }
        if (typeof forwardedRef === 'function') {
            forwardedRef(innerRef.current);
            return;
        } else {
            // @ts-ignore
            // by default forwardedRef.current is readonly. Let's ignore it
            forwardedRef.current = innerRef.current;
        }
    });
    return innerRef;
}
const customHooks = { useOutsideClick, useCombinedForwardAndInnerRef };
export default customHooks;
