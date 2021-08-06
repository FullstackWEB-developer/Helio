import React from 'react';
import './modal-overlay.scss';
import classNames from 'classnames';
export interface ModalOverlayProps {
    isActive: boolean;
}

const ModalOverlay = ({isActive}: ModalOverlayProps) => {
    const overlayClassName = classNames(' h-full w-full', {
        'modal-overlay-active absolute top-0 left-0 pointer-events-none z-50': isActive,
        'pointer-events': !isActive
    });

    return (
        <div className='flex h-full w-full items-center justify-center'>
            <div className={overlayClassName}>
            </div>
        </div>
    );
}

export default ModalOverlay;
