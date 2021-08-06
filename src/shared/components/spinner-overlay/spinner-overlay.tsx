import React from 'react';
import './spinner-overlay.scss';
import Spinner from '@components/spinner/Spinner';
import classNames from 'classnames';
export interface SpinnerOverlayProps {
    isActive: boolean;
    children: React.ReactElement;
}

const SpinnerOverlay = ({children, isActive} : SpinnerOverlayProps) => {
    const overlayClassName = classNames(' h-full w-full', {
        'overlay-active absolute top-0 left-0 pointer-events-none' : isActive,
        'pointer-events' : !isActive
    });

    return <div className='flex h-full w-full items-center justify-center'>
            {isActive && <Spinner size='large-40'/>}
                <div className={overlayClassName}>
                    {children}
                </div>
            </div>
}

export default SpinnerOverlay;
