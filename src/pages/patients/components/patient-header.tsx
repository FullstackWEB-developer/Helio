import {useTranslation} from 'react-i18next';
import {selectPatient} from '../store/patients.selectors';
import {useSelector} from 'react-redux';
import {ExtendedPatient} from '../models/extended-patient';
import React, {useEffect, useRef, useState} from 'react';
import Tooltip from '@components/tooltip/tooltip';
import {PatientChartSummary} from '../models/patient-chart-summary';
import PatientChartAlert from './patient-chart-alert';
import Button from '@components/button/button';
import Avatar from '@components/avatar/avatar';
import patientUtils from '../utils/utils';
import utils from "@shared/utils/utils";
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import customHooks from '@shared/hooks/customHooks';
import PatientHeaderActions from '@pages/patients/components/patient-header-actions';

export interface PatientHeaderProps {
    patientChartSummary: PatientChartSummary;
    refreshPatient: () => void;
}

const PatientHeader = ({patientChartSummary, refreshPatient}: PatientHeaderProps) => {
    const {t} = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);
    const chartAlertIcon = useRef(null);
    const [displayChartAlert, setDisplayChartAlert] = useState<boolean>(false);
    const tooltipDiv = useRef<HTMLDivElement>(null);

    customHooks.useOutsideClick([tooltipDiv], () => {
        setDisplayChartAlert(false);
    });

    const SmallLabel = (text: string, value: string, className?: string) => {
        return (
            <div className={className}>
                <span className={'body-medium'}>{text}</span>
                <span className={'pl-1.5'}>{value}</span>
            </div>
        )
    }

    useEffect(() => {
        if (patientChartSummary.chartAlert?.noteText && patientChartSummary.chartAlert.noteText.length > 0) {
            setDisplayChartAlert(true);
        }
    }, [patientChartSummary.chartAlert?.noteText])

    const viewInAthena = () => {
        const url = `${utils.getAppParameter('AthenaHealthUrl')}${utils.getAppParameter('AthenaPatientFormUrl')}${patient.patientId}`;
        window.open(url, '_blank');
    }

    const getImage = () => {
        if (patientChartSummary?.patientPicture && patientChartSummary.patientPicture.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-24 h-24 rounded-full'
                src={`data:image/jpeg;base64,${patientChartSummary.patientPicture}`} />
        }

        return <Avatar className='w-24 h-24 h3' userFullName={utils.stringJoin(' ', patient.firstName, patient.lastName)} />
    }

    return (
        <div className={'flex flex-row p-8 bg-gray-50  justify-between'}>
            <div className='flex flex-row w-full'>
                <div className={'h-24 w-24'}>
                    {getImage()}
                </div>
                <div className='w-full pt-4 pl-8'>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='flex flex-row items-start'>
                            <div>
                                <h5 className={'h5'}>{`${patient.firstName} ${patient.lastName}`}</h5>
                            </div>
                            <div>
                                <h5 className={'pl-6 gray-id'}>{t('patient.header.id')}</h5>
                            </div>
                            <div>
                                <h5 className={'pl-1 pr-2'}>{patient.patientId}</h5>
                            </div>
                            {
                                patientChartSummary?.chartAlert &&
                                <div ref={tooltipDiv} className='pt-1'>
                                    <div ref={chartAlertIcon} onClick={() => setDisplayChartAlert(!displayChartAlert)}
                                        className='cursor-pointer'>
                                        <SvgIcon type={Icon.Info} className='icon-medium' fillClass='warning-icon' />
                                    </div>
                                    <Tooltip targetRef={chartAlertIcon} isVisible={displayChartAlert}
                                        placement='bottom-start'>
                                        <PatientChartAlert chartAlert={patientChartSummary.chartAlert} />
                                    </Tooltip>
                                </div>
                            }
                        </div>
                        <Button data-test-id='patient-header-view-in-athena-button'
                            buttonType='medium'
                            onClick={() => viewInAthena()}
                            className=""
                            label={'patient.header.view_in_athena'} />
                    </div>
                    <div className='flex flex-row justify-between pt-4'>
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
                    <PatientHeaderActions patient={patient} refreshPatient={() => refreshPatient()}/>
                </div>
            </div>
        </div>
    );
}

export default PatientHeader;
