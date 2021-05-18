import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

interface AccordionProps {
    title?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onClick?: (isCollapsed: boolean) => void;
}

const Collapsible = ({title, children, isOpen = false, ...props}: AccordionProps) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const toggle = () => {
        setOpen(!open);
    }
    const onClick = () => {
        toggle();
        if (props.onClick) {
            props.onClick(!open);
        }
    }

    return <div>
        <div className='h-12 cursor-pointer flex flex-row justify-between items-center' onClick={() => onClick()}>
            <div className='subtitle'>{t(title || '')}</div>
            <div>
                {open ? <SvgIcon type={Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
                    : <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon' />}
            </div>
        </div>
        {<div hidden={!open}>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
