import React from 'react';
import {ReactComponent as CloseIcon} from '../../icons/Icon-Close.svg';
import './modal.scss';

interface ModalProps {
    isOpen: boolean,
    children: React.ReactNode,
    title?: string,
    isClosable?: boolean,
    onClose?: (event: React.MouseEvent<HTMLDivElement>) => void
}
const Modal = ({ isOpen, children, title, isClosable, onClose }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className='modal-body bg-white z-50 top-60 absolute border rounded px-6'>
                <div className='h-18 flex justify-between'>
                    <h6 className='pt-9 pb-2'>{title}</h6>
                    {isClosable && <div className='pt-9 cursor-pointer' onClick={onClose}><CloseIcon/></div>}
                </div>
                {children}
            </div>
        </>
    );
}

export default Modal;
