import React, {MutableRefObject, ReactNode, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import {Placement} from '@popperjs/core';
import './tooltip.scss';

type TooltipProps = {
    targetRef: MutableRefObject<Element | null>;
    isVisible: boolean;
    children: ReactNode;
    placement?: Placement;
    showArrow?: boolean;
};

const Tooltip = ({targetRef, isVisible, children, placement = 'bottom', showArrow = true}: TooltipProps) => {
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
    const {styles, attributes} = usePopper(
        targetRef.current,
        popperRef.current,
        {
            placement: placement,
            modifiers: [
                {
                    name: "arrow",
                    options: {
                        element: arrowRef
                    }
                },
                {
                    name: "offset",
                    options: {
                        offset: [0, 10]
                    }
                }
            ]
        }
    );

    if (!isVisible) {
        return null;
    }

    return (
        <div className='z-10 tooltip-container' data-test-id='tooltip-container'
            ref={popperRef}
            style={styles.popper}
            {...attributes.popper}
        >
            {showArrow && <div ref={setArrowRef} style={styles.arrow} className="arrow" data-test-id='tooltip-arrow' />}
            {children}
        </div>
    );
};


export default Tooltip;
