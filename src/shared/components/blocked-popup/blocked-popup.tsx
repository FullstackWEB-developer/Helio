import Button from '@components/button/button';
import Modal from '@components/modal/modal';
import utils from '@shared/utils/utils';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

const BlockedPopup = () => {
    const popupExplanatoryURLs = JSON.parse(utils.getAppParameter('BlockedPopupExplanatoryUrls'));
    const [displayBlockedPopupsModal, setDisplayBlockedPopupsModal] = useState(false);
    useEffect(() => {
        var openAttempt = window.open();
        if (!openAttempt || openAttempt.closed || typeof openAttempt.closed === 'undefined') {
            setDisplayBlockedPopupsModal(true);
        }
        openAttempt?.close();
    }, []);
    const {t} = useTranslation();
    return <Modal isOpen={displayBlockedPopupsModal} isDraggable={true} closeableOnEscapeKeyPress={false}
        onClose={() => setDisplayBlockedPopupsModal(false)} isClosable={true} className='max-w-md z-50'>
        <div className='flex flex-col'>
            <div className='h7'>{t('blocked_popup.title')}</div>
            <div className='body2 pt-3 pb-7'>{t('blocked_popup.content')}</div>
            <Link to={{pathname: popupExplanatoryURLs?.chrome}} target='_blank' className='body2-primary hover:underline pb-2'>{t('blocked_popup.chrome_settings')}</Link>
            <Link to={{pathname: popupExplanatoryURLs?.firefox}} target='_blank' className='body2-primary hover:underline pb-2'>{t('blocked_popup.firefox_settings')}</Link>
            <Link to={{pathname: popupExplanatoryURLs?.edge}} target='_blank' className='body2-primary hover:underline pb-16'>{t('blocked_popup.edge_settings')}</Link>
            <Button label='common.ok' className='mb-6 w-24 ml-auto' onClick={() => setDisplayBlockedPopupsModal(false)} />
        </div>
    </Modal>;
}

export default BlockedPopup;