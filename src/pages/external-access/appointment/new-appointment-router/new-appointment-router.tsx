import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';
import Radio from '@components/radio/radio';
import {PatientStatus} from '../../models/patient-status.enum';
import Button from '@components/button/button';
import {useHistory} from 'react-router';
import {RegistrationPath, AppointmentSchedulePath} from '@app/paths';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';

const NewAppointmentRouter = () => {

    const {t} = useTranslation();
    const history = useHistory();

    const patientStatusOptions: Option[] = [
        {label: 'external_access.appointments.new_appointment.existing_patient', value: PatientStatus.Existing},
        {label: 'external_access.appointments.new_appointment.new_patient', value: PatientStatus.New}
    ];
    const [patientStatus, setPatientStatus] = useState('');

    const routePatientByStatus = () => {
        switch (patientStatus) {
            case PatientStatus.New: {
                history.replace(RegistrationPath);
                break;
            }
            case PatientStatus.Existing: {
                history.replace(AppointmentSchedulePath);
                break;
            }
        }
    }
    return (
        <div className='flex flex-col appointment-schedule-select without-default-padding without-default-padding-right without-default-padding-bottom'>
            <h4 className='pt-16'>
                {t('external_access.appointments.new_appointment.title')}
            </h4>
            <div className='pt-12 pb-7'>{t('external_access.appointments.new_appointment.patient_status_question')}</div>
            <Radio
                name="patient-status"
                truncate={true}
                value={patientStatus}
                items={patientStatusOptions}
                onChange={(value) => setPatientStatus(value)}
            />
            <Button label='common.continue' className='my-12 w-36' buttonType='big' disabled={!patientStatus} onClick={routePatientByStatus} />
            <ExternalUserEmergencyNote type={ExternalAccessRequestTypes.None} />
        </div>
    )
}

export default NewAppointmentRouter;