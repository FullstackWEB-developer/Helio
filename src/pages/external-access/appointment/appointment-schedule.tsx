import React from 'react';
import {useTranslation} from 'react-i18next';

const AppointmentSchedule = () => {
    const {t} = useTranslation();

    return <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_schedule')}
            </h4>
        </div>
    </div>
}

export default AppointmentSchedule;
