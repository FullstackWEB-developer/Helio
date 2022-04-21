import Confirmation from '@components/confirmation/confirmation';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {isMobile} from 'react-device-detect';

const HipaaWarningModal = ({title = 'common.close_window_title', actionTranslation, modalOpensAfterSeconds = 2.5}:
    {title?: string, actionTranslation: string, modalOpensAfterSeconds?: number}) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => setIsOpen(true), modalOpensAfterSeconds * 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    const modalBody = t('common.close_window_message', {action: t(actionTranslation)})
    if(isMobile){
        return null;
    }    
    return (
        <>
            <Confirmation title={title}
                isDraggable={true}
                onOk={() => setIsOpen(false)}
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
                displayCancel={false}
                message={modalBody} />
        </>
    )
}

export default HipaaWarningModal;