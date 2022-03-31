import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import {usePopper} from 'react-popper';
import './elipsis-tooltip-textbox.scss';

interface ElipsisTooltipTextboxProps {
    value: string;
    asSpan?: boolean;
    classNames?: string;
    yOffsetInPixels?: number;
}

const ElipsisTooltipTextbox = ({value, asSpan = false, classNames, yOffsetInPixels}: ElipsisTooltipTextboxProps) => {
    const {t} = useTranslation();
    const classes = classnames(classNames);
    const ref = useRef(null);

    const [overflowActive, setOverflowActive] = useState(false);
    const isOverflowActive = (e) => {
        if (!e) return false;
        return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    }
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (ref?.current && isOverflowActive(ref.current)) {
            setOverflowActive(true);
            return;
        }
        setOverflowActive(false);
    }, [isOverflowActive]);


    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const {styles, attributes, update} = usePopper(ref.current, popper, {
        placement: 'top-start',
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, yOffsetInPixels],
            },
        }]
    });

    useEffect(() => {
        if (isVisible && update) {
            update().then();
        }
    }, [update, isVisible]);


    return (
        <div ref={ref} className='relative inline-block w-full h-full truncate'>
            {
                asSpan ? <span onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className={classes}>{t(value)}</span> :
                    <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className={classes}>{t(value)}</div>
            }
            {
                overflowActive &&
                <div
                    className={classnames('z-10 elipsis-tooltip body3 flex items-center justify-center', {'hidden': !isVisible})}
                    style={styles.popper}
                    ref={setPopper}
                    {...attributes.popper}>
                    {t(value)}
                </div>
            }
        </div>
    )
}

export default ElipsisTooltipTextbox;
