import React from 'react';
import {NotificationTemplate} from '@shared/models/notification-template.model';
import {useTranslation} from 'react-i18next';

export interface SelectedTemplateInfoProps {
    selectedMessageTemplate?: NotificationTemplate;
}
const SelectedTemplateInfo = ({selectedMessageTemplate} : SelectedTemplateInfoProps) => {
    const {t} = useTranslation();
    if (selectedMessageTemplate) {
        return <div className='flex flex-row'>
            <div className='body2-medium whitespace-pre'>{t('ticket_detail.template')}</div>
            <div
                className='body2'>{` ${selectedMessageTemplate.category} - ${selectedMessageTemplate.logicKey}`}</div>
        </div>
    }
    return <></>
}

export default SelectedTemplateInfo;
