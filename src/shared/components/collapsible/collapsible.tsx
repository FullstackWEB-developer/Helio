import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, { useEffect, useState } from 'react';
import {useTranslation} from 'react-i18next';
import { ReactComponent as ArrowDownIcon } from '../../icons/Icon-Arrow-down-16px.svg';
import { ReactComponent as ArrowUpIcon } from '../../icons/Icon-Arrow-up-16px.svg';
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
                {open ? <ArrowUpIcon/> : <ArrowDownIcon/>}
            </div>
        </div>
        {open && <div>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
