import {useState, RefObject, useEffect, useCallback} from 'react';
import utils from '@shared/utils/utils';
import {useMutationObserver} from './useMutationObservable';

export interface ElementPosition {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

const useSmartPosition = <TTarget extends HTMLElement, TRelative extends HTMLElement>(
    target: RefObject<TTarget>,
    relativeTo: RefObject<TRelative>,
    enabled: boolean
) => {
    const [position, setPosition] = useState<ElementPosition>({});
    const calcPosition = useCallback(() => {
        if (enabled) {
            if (!relativeTo.current || !target.current) {
                return;
            }
            
            const {top, left} = utils.getElementPosition(relativeTo.current);
            const dropdownHeight = target.current.clientHeight ?? 0;
            const elementRect = target.current.getBoundingClientRect();
            const isTop = top > elementRect.top && top > elementRect.bottom;

            if (!isTop && !utils.isInBounds(elementRect.top, elementRect.left, elementRect.bottom, elementRect.right, 'vertically')) {
                setPosition({top: top - dropdownHeight, left: left, right: elementRect.right});
                return;
            }

            if (utils.isInBounds(top, elementRect.left, top + dropdownHeight + relativeTo.current.offsetHeight, elementRect.right,'vertically')) {
                setPosition({top: top + relativeTo.current.offsetHeight, left: left, right: elementRect.right});
            } else {
                setPosition({top: top - dropdownHeight, left: left, right: elementRect.right});
            }
        }
    }, [enabled, relativeTo, target]);

    useMutationObserver(target, {characterData: true, childList: true, subtree: true}, () => calcPosition())

    useEffect(() => {
        calcPosition();
    }, [calcPosition, enabled]);

    return position;
}

export default useSmartPosition;
