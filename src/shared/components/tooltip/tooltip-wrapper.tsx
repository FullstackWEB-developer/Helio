import React, {ReactNode, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import './tooltip.scss';
import {useTranslation} from 'react-i18next';
import {Placement} from '@popperjs/core';

type TooltipWrapperProps = {
    content?: string | React.ReactNode;
    children: ReactNode;
    placement?: Placement;
};

const TooltipWrapper = ({content, children, placement = 'bottom'}: TooltipWrapperProps) => {
    const popperRef = useRef(null);
    const {t} = useTranslation();
    const [arrowRef, setArrowRef] = useState< HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setVisible] = useState<boolean>(false);
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

    if (!content || !isVisible) {
        return <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>{children}</div>
    }

    return (
        <>
            <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} ref={targetRef}>{children}</div>
            <span className='z-10 tooltip-container' data-test-id='tooltip-container'
                 ref={popperRef}
                 style={styles.popper}
                 {...attributes.popper}
            >
                <div ref={setArrowRef} style={styles.arrow} className="arrow" data-test-id='tooltip-arrow' />
                {typeof content === 'string' ? <div className='body3-small normal-case px-6 py-4 rounded-xl whitespace-pre-line'>{t(content)}</div> : content}
            </span>
        </>
    );
};


export default TooltipWrapper;
