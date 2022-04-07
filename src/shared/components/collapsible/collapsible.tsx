import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';


interface AccordionProps {
    title?: string;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onClick?: (isCollapsed: boolean) => void;
}

const Collapsible = ({title, children, className, headerClassName = 'h-12', titleClassName = 'subtitle', isOpen = false, ...props}: AccordionProps) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(isOpen);

    const toggle = () => {
        setOpen(!open);
    }
    const onClick = () => {
        toggle();
        if (props.onClick) {
            props.onClick(!open);
        }
    }

    return <div className={className}>
        <div className={classnames('cursor-pointer flex flex-row justify-between items-center', headerClassName)} onClick={() => onClick()}>
            <div className={titleClassName}>{t(title || '')}</div>
            <div>
                {open ? <SvgIcon type={Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
                    : <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon' />}
            </div>
        </div>
        {<div hidden={!open}>{children}</div>}
    </div>;
}

export default withErrorLogging(Collapsible);
