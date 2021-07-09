import React from 'react';
import './overlay.scss';
import Spinner from '@components/spinner/Spinner';
import classNames from 'classnames';
export interface OverlayProps {
    isActive: boolean;
    children: React.ReactElement;
}

const Overlay = ({children, isActive} : OverlayProps) => {
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

export default Overlay;
