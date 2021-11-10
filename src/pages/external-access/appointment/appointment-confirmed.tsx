import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {useHistory} from 'react-router';

const AppointmentConfirmed = () => {
    const {t}= useTranslation();
    const history = useHistory();
    history.listen((_, action) => {
        if (action === "POP") {
            history.go(1);
        }
    });
    return (
        <div className='flex flex-col without-default-padding without-default-padding-right without-default-padding-bottom'>
            <h4 className='pt-16'>
                {t('external_access.appointments.confirmation.confirmed_title')}
            </h4>
            <div className='pt-6 whitespace-pre-line'>
                <Trans i18nKey="external_access.appointments.confirmation.confirmed_desc">
                    <a rel='noreferrer' target='_self' href={utils.getAppParameter('ChatLink')}>Chat</a>
                    {utils.getAppParameter('CallUsPhone')}
                </Trans>
            </div>
        </div>
    );
}

export default AppointmentConfirmed;