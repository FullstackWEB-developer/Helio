import { useTranslation } from 'react-i18next';
import { selectPatient } from '../store/patients.selectors';
import { useSelector } from 'react-redux';
import { ExtendedPatient } from '../models/extended-patient';
import React, { useRef, useState } from 'react';
import Tooltip from '@components/tooltip/tooltip';
import { PatientChartSummary } from '../models/patient-chart-summary';
import PatientChartAlert from './patient-chart-alert';
import { ReactComponent as InfoIcon } from '@icons/Icon-Info-24px.svg';
import Button from '@components/button/button';
import Avatar from '@components/avatar/avatar';
import {AvatarModel} from '@components/avatar/avatar.models';
import patientUtils from '../utils/utils';
import utils from "@shared/utils/utils";
const athenaPatientUrl = process.env.REACT_APP_ATHENAHEALTH_CLIENT_SUMMARY;

export interface PatientHeaderProps {
    patientChartSummary: PatientChartSummary;
}
const PatientHeader = ({patientChartSummary} : PatientHeaderProps) => {
    const { t } = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);

    const SmallLabel = (text: string, value: string, className?: string) => {
        return (
            <div className={className}>
                <span className={'body-medium'}>{text}</span>
                <span className={'pl-1.5'}>{value}</span>
            </div>
        )
    }

    const chartAlertIcon = useRef(null);
    const [chartAlertHovered, setChartAlertHovered] = useState(false);

    const viewInAthena = () => {
            const url = `${athenaPatientUrl}${patient.patientId}`;
            window.open(url, '_blank');
    }

    const GetImage = () => {
        if (patientChartSummary?.patientPicture &&  patientChartSummary.patientPicture.length> 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-24 h-24 rounded-full' src={`data:image/jpeg;base64,${patientChartSummary.patientPicture}`} />
        }
        const initials = utils.getInitialsFromFullName(`${patient.firstName} ${patient.lastName}`);
        const model : AvatarModel = {
            initials,
            className:'w-24 h-24'
        }
        return <Avatar model={model}/>
    }

    return (
        <div className={'flex flex-row p-8 bg-gray-50'}>
            <div className={'h-24 w-24'}>
                {GetImage()}
            </div>
            <div className={'pl-8 pt-4'}>
                <div className={'flex flex-row'}>
                    <h5 className={'h5'}>{`${patient.firstName} ${patient.lastName}`}</h5>
                    <h5 className={'pl-6 gray-id'}>{t('patient.header.id')}</h5>
                    <h5 className={'pl-1'}>{patient.patientId}</h5>
                    {
                        patientChartSummary?.chartAlert &&
                        <>
                            <span className={'pl-4 pt-1'}>
                                <InfoIcon ref={chartAlertIcon}
                                    onMouseOver={() => setChartAlertHovered(true)}
                                    onMouseOut={() => setChartAlertHovered(false)}>
                                </InfoIcon>
                            </span>
                            <Tooltip targetRef={chartAlertIcon} isVisible={chartAlertHovered} placement='bottom-start'>
                                <PatientChartAlert chartAlert={patientChartSummary.chartAlert} />
                            </Tooltip>
                        </>
                    }
                </div>
                <div className={'pt-4 flex flex-row'}>
                    <div className='flex flex-row'>
                        {
                            SmallLabel(t('patient.header.age'), patientUtils.getAge(patient.dateOfBirth).toString())
                        }
                        {
                            SmallLabel(t('patient.header.sex'), patient.sex, 'pl-6')
                        }
                        {
                            SmallLabel(t('patient.header.dob'), patientUtils.formatDob(patient.dateOfBirth), 'pl-6')
                        }
                        {
                            SmallLabel(t('patient.header.ssn'), patient.ssn ? patient.ssn.replace(/.{1,5}/, (m) => '*'.repeat(m.length)) : t('common.not_available'), 'pl-6')
                        }
                    </div>
                </div>
            </div>
            <div className='h-11 ml-52 mt-8'>
                <Button data-test-id='patient-header-view-in-athena-button'
                        buttonType='medium'
                        onClick={() => viewInAthena()}
                        label={'patient.header.view_in_athena'} />
            </div>
        </div>
    );
}

export default PatientHeader;
