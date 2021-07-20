import React from 'react';
import './modal.scss';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {useTranslation} from 'react-i18next';

interface ModalProps {
    isOpen: boolean,
    children: React.ReactNode,
    title?: string,
    isClosable?: boolean,
    top?: number
    onClose?: (event: React.MouseEvent<HTMLDivElement>) => void
}
const Modal = ({ isOpen, children, title='', isClosable, onClose, top=60 }: ModalProps) => {
    const {t} = useTranslation();
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className={`modal-body bg-white z-50 top-${top} absolute border rounded px-6`}>
                <div className='h-18 flex justify-between'>
                    <h6 className='pt-9 pb-2'>{t(title)}</h6>
                    {isClosable && <div className='pt-9 cursor-pointer' onClick={onClose}>
                        <SvgIcon type={Icon.Close} className='icon-medium' fillClass='active-item-icon'/>
                    </div>}
                </div>
                {children}
            </div>
        </>
    );
}

export default Modal;
