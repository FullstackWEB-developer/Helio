import {RefObject, useEffect, useMemo} from "react";


export const useMutationObserver = <T extends HTMLElement>(
    target: RefObject<T>,
    options?: MutationObserverInit,
    callback?: MutationCallback
): void => {
    const observer = useMemo(
        () => {
            return new MutationObserver((mutationRecord, mutationObserver) => {
                callback?.(mutationRecord, mutationObserver);
            })
        },
        [callback]
    );

    useEffect(() => {
        const element = target?.current;

        if (observer && element) {
            observer.observe(element, options);
            return () => observer.disconnect();
        }
        return () => { };
    }, [target, observer, options]);
    
};