import { useTranslation } from 'react-i18next';
import { selectPatient } from '../store/patients.selectors';
import { useSelector } from 'react-redux';
import utils from '../utils/utils';
import { ExtendedPatient } from '../models/extended-patient';
import React from 'react';
import { ReactComponent as InfoIcon } from '../../../shared/icons/Icon-Info-24px.svg';

const PatientHeader = () => {
    const { t } = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);
    const SmallLabel = (text: string, value: string) => {
        return (
            <div>
                <span className={'text-gray-400'}>{text}</span>
                <span className={'pl-2'}>{value}</span>
            </div>
        )
    }
    return (
        <div className={'flex flex-row p-8'}>
            <div className={'h-24 w-24 bg-gray-200'} />
            <div className={'pl-8 pt-4'}>
                <div className={'flex flex-row text-2xl'}>
                    <span className={'font-bold'}>{`${patient.firstName} ${patient.lastName}`}</span>
                    <span className={'pl-8'}>{t('patient.header.id')}</span>
                    <span className={'font-bold pl-4'}>{patient.patientId}</span>
                    <span className={'pl-4 pt-1'}><InfoIcon></InfoIcon></span>
                </div>
                <div className={'pt-4 flex flex-row text-xl'}>
                    <div className='flex space-x-10'>
                        {
                            SmallLabel(t('patient.header.age'), utils.getAge(patient.dateOfBirth).toString())
                        }
                        {
                            SmallLabel(t('patient.header.sex'), patient.sex)
                        }
                        {
                            SmallLabel(t('patient.header.dob'), utils.formatDob(patient.dateOfBirth))
                        }
                        {
                            SmallLabel(t('patient.header.ssn'), patient.ssn?.replace(/.{1,5}/, (m) => '*'.repeat(m.length)))
                        }
                    </div>
                </div>
            </div>
            <div className='h-11 border rounded-md ml-32 mt-8 pt-2 pb-2 pl-8 pr-8'>
                {t('patient.header.view_in_athena')}
            </div>
        </div>
    );
}

export default PatientHeader;
