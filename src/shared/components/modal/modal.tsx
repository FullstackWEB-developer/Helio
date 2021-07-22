import React from 'react';
import './modal.scss';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import classname from 'classnames';
import {useTranslation} from 'react-i18next';

interface ModalProps {
    isOpen: boolean,
    children: React.ReactNode,
    title?: string,
    isClosable?: boolean,
    className?: string,
    top?: number
    onClose?: (event: React.MouseEvent<HTMLDivElement>) => void
}
const Modal = ({isOpen, children, title = '', isClosable, className, onClose, top = 60}: ModalProps) => {
    const {t} = useTranslation();
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className={classname(`modal-body bg-white z-50 top-${top} absolute border rounded px-6`, className)}>
                <div className='flex justify-between h-18'>
                    <h6 className='pb-2 pt-9'>{t(title)}</h6>
                    {isClosable && <div className='cursor-pointer pt-9' onClick={onClose}>
                        <SvgIcon type={Icon.Close} className='icon-medium' fillClass='active-item-icon' />
                    </div>}
                </div>
                {children}
            </div>
        </>
    );
}

export default Modal;
