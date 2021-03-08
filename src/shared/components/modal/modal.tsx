import React from 'react';
import { ReactComponent as CloseIcon } from '../../icons/Icon-Close.svg';

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
            <div className='modal bg-white z-50 top-60 shadow-xl absolute border px-6'>
                <div className='pb-3 h-18 flex justify-between'>
                    <h5 className='pt-4'>{title}</h5>
                    {isClosable && <div className='pt-4 cursor-pointer' onClick={onClose}><CloseIcon/></div>}
                </div>
                {children}
            </div>
        </>
    );
}

export default Modal;
