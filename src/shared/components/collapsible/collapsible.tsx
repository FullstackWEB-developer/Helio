import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, { useEffect, useState } from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
interface AccordionProps {
    title?: string;
    children: React.ReactNode;
    isOpen?: boolean;
}

const Collapsible = ({title, children, isOpen = false} : AccordionProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const toggle = () => {
        setOpen(!open);
    }

    return <div>
        <div className='h-12 cursor-pointer flex flex-row justify-between items-center' onClick={ () => toggle()}>
            <div className='subtitle'>{t(title || '')}</div>
            <div>
                {open ? <SvgIcon type={Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon'/>
                    : <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon'/>}
            </div>
        </div>
        {open && <div>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
