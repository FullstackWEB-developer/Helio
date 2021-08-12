import React from 'react';
import './modal.scss';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import classname from 'classnames';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';

interface ModalProps {
    isOpen: boolean,
    children: React.ReactNode,
    title?: string,
    isClosable?: boolean,
    className?: string,
    top?: number
    onClose?: (event: React.MouseEvent<HTMLDivElement>) => void,
    closeableOnEscapeKeyPress?: boolean
}
const Modal = ({isOpen, children, title = '', isClosable, className, onClose, top = 60, closeableOnEscapeKeyPress}: ModalProps) => {
    const {t} = useTranslation();

    useEffect(() => {
        const close = (e: any) => {
            if (e.key === 'Escape' && closeableOnEscapeKeyPress && onClose) {
                onClose(e);
            }
        }
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className={classname(`modal-body bg-white z-50 top-${top} absolute border rounded`, className)}>
                <div className='flex justify-between h-18'>
                    <h6 className='px-6 pb-2 pt-9'>{t(title)}</h6>
                    {isClosable && <div className='pt-4 pr-4 cursor-pointer' onClick={onClose}>
                        <SvgIcon type={Icon.Close} className='icon-medium' fillClass='active-item-icon' />
                    </div>}
                </div>
                <div className='px-6'>
                    {children}
                </div>
            </div>
        </>
    );
}

export default Modal;
