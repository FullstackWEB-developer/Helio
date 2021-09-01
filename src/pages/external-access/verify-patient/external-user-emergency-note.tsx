import React from 'react';
import {useTranslation} from 'react-i18next';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import SvgIcon, {Icon} from '@components/svg-icon';

const ExternalUserEmergencyNote = ({type} : {type: ExternalAccessRequestTypes}) => {
    const {t} = useTranslation();
    const nonDisplayedTypes = [
        ExternalAccessRequestTypes.RequestRefill,
        ExternalAccessRequestTypes.GetLabResults,
        ExternalAccessRequestTypes.RequestMedicalRecords,
        ExternalAccessRequestTypes.GetAppointmentDetail,
        ExternalAccessRequestTypes.BookAppointment
    ]
    if (nonDisplayedTypes.some(a => a === type)) {
        return null;
    }
    return <div className='flex flex-row space-x-6 items-center pt-16'>
        <SvgIcon type={Icon.Emergency} fillClass='rgba-038-fill' className='icon-x-large'/>
        <div>{t('external_access.emergency_note')}</div>
    </div>;
}

export default ExternalUserEmergencyNote;
