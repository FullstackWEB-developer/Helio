import React from 'react';
import './patient-hover-info.scss';
import {useQuery} from 'react-query';
import {GetPatientPhoto, QueryGetPatientById} from '@constants/react-query-constants';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import Spinner from '@components/spinner/Spinner';
import Avatar from '@components/avatar';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import PatientHeaderActions from '@pages/patients/components/patient-header-actions';
import Button from '@components/button/button';
import {useHistory} from 'react-router-dom';
import {Icon} from '@components/svg-icon';
import {EmailPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';
import TicketCreatedForHoverLabel from '@pages/tickets/components/ticket-detail/ticket-created-for-hover-label';
export interface PatientHoverInfoProps {
    patientId: number;
}
const PatientHoverInfo= ({patientId}: PatientHoverInfoProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const {data: patient, isLoading} = useQuery([QueryGetPatientById, patientId], () => getPatientByIdWithQuery(patientId));
    const {data: patientPhoto, isFetching: fetchingPhoto} = useQuery([GetPatientPhoto, patientId], () => getPatientPhoto(patientId));

    if (isLoading) {
        return <div className='patient-hover-info-wrapper'>
            <Spinner fullScreen={true}/>
        </div>
    }

    if (!patient) {
        return <div className='patient-hover-info-wrapper'>
            {t('tickets.hover_info.error_getting_patient_details')}
        </div>
    }

    const getImage = () => {
        if (fetchingPhoto) {
            return <Spinner className='w-10 h-10' />
        }
        if (patientPhoto && patientPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10=4 rounded-full'
                        src={`data:image/jpeg;base64,${patientPhoto}`} />
        }
        return <Avatar className='w-10 h-10 subtitle2 avatar-patient' userFullName={utils.stringJoin(' ', patient.firstName, patient.lastName)} />
    }

    const sendEmail = () =>{
        if (!!patient.emailAddress) {
            history.push(`${EmailPath}/${NEW_EMAIL}`, {
                patient
            });
        }
    }

    return <div className='absolute border-1 bg-white z-50 patient-hover-info-wrapper flex flex-col border-1 rounded-sm'>
        <div className='pl-4 pr-4.5 pt-6 pb-2 patient-hover-info-header border-b border-gray-200'>
            <div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row items-center'>
                        <div>
                            {getImage()}
                        </div>
                        <div className='h6 pl-4'>
                            {utils.stringJoin(' ', patient.firstName, patient.lastName)}
                        </div>
                    </div>
                    <div className='body2'>{t("tickets.hover_info.patient_title")}</div>
                </div>
                <div className='pl-12'>
                    <PatientHeaderActions patient={patient}/>
                </div>
            </div>

        </div>
        <div className='pt-6 pb-4 flex flex-col pl-4 space-y-1'>
            <TicketCreatedForHoverLabel
                label='tickets.hover_info.mobile_phone'
                isActive={!!patient.mobilePhone}
                icon={Icon.Phone}
                linkText={utils.formatPhone(patient.mobilePhone)}
                onClick={() => utils.initiateACall(patient?.mobilePhone)}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.home_phone'
                isActive={!!patient.homePhone}
                icon={Icon.Phone}
                linkText={utils.formatPhone(patient.homePhone)}
                onClick={() => utils.initiateACall(patient?.homePhone)}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.email'
                isActive={!!patient.emailAddress}
                icon={Icon.Email}
                linkText={patient.emailAddress}
                onClick={() => sendEmail()}
            />


        </div>
        <div className='patient-hover-info-button-wrapper h-24 pl-4 pt-6 bottom-0 absolute w-full'>
            <Button label='tickets.hover_info.view_patient' onClick={() => history.push(`/patients/${patientId}`)}/>
        </div>
    </div>
}

export default PatientHoverInfo;
