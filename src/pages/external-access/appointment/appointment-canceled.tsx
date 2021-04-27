import React from 'react';
import {Trans, useTranslation} from 'react-i18next';

const AppointmentCanceled = () => {
    const {t} = useTranslation();
    const callUsPhone = process.env.REACT_APP_CALL_US_PHONE;
    const scheduleAppointmentLink = '/o/appointment-schedule';
    const chatLink = process.env.REACT_APP_CHAT_LINK;

    return <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_canceled')}
            </h4>
        </div>
        <div className='pt-6'>
            <Trans i18nKey="external_access.appointments.to_schedule">
                <a rel='noreferrer' className='underline' target='_blank' href={scheduleAppointmentLink}>here</a>
                <a rel='noreferrer' className='underline' target='_blank' href={chatLink}>Chat</a>
                {callUsPhone}
            </Trans>
        </div>
        <div>
            {t('external_access.appointments.we_will_be_happy')}
        </div>
    </div>
}

export default AppointmentCanceled;
