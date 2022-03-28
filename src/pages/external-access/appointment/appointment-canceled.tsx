import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';

const AppointmentCanceled = () => {
    const {t} = useTranslation();
    const scheduleAppointmentLink = '/o/appointment-schedule';

    return <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_canceled')}
            </h4>
        </div>
        <div className='pt-6'>
            <Trans i18nKey="external_access.appointments.to_schedule">
                <a rel='noreferrer' target='_self' href={scheduleAppointmentLink}>here</a>
                <a rel='noreferrer' target='_self' href={utils.getAppParameter('ChatLink')}>Chat</a>
            </Trans>
        </div>
        <div>
            {t('external_access.appointments.we_will_be_happy')}
        </div>
    </div>
}

export default AppointmentCanceled;
