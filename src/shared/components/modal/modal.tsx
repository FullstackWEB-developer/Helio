import React from 'react';
import './modal.scss';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import classname from 'classnames';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import Portal from '@components/modal/portal';
import Draggable from 'react-draggable';
import classNames from 'classnames';

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    title?: string;
    isClosable?: boolean;
    className?: string;
    onClose?: (event: React.MouseEvent<HTMLDivElement>) => void;
    closeableOnEscapeKeyPress?: boolean;
    isDraggable?: boolean;
    hasOverlay?: boolean;
}
const Modal = ({isOpen, children, title = '', isClosable, className, onClose, closeableOnEscapeKeyPress, isDraggable = false, hasOverlay = false}: ModalProps) => {
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



    const overlayClassName = classNames('h-full w-full', {
        'modal-overlay-active absolute top-0 left-0 z-20': isOpen && hasOverlay,
        'pointer-events': !isOpen
    });


    if (!isOpen) {
        return null;
    }

    return (
        <React.Fragment>
            <div className='flex h-full w-full items-center justify-center'>
                <div>
                    <Portal className={overlayClassName}>
                        <Draggable disabled={!isDraggable} bounds='parent'>
                            <div className={classname(`modal-body bg-white z-50 border rounded`, className, {
                                'cursor-move': isDraggable
                            })}>
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
                        </Draggable>
                    </Portal>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Modal;
