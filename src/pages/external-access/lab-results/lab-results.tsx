import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {getPatientsLabResults} from './services/lab-results.service';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import {selectVerifiedPatent} from '../../patients/store/patients.selectors';
import LabResultListItem from './components/lab-result-list-item';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import LabResultSendAMessage from './components/lab-result-send-a-message';
import {useQuery} from 'react-query';
import {GetLabResults} from '@constants/react-query-constants';
import {LabResult} from './models/lab-result.model';
import './lab-results.scss';

const LabResults = () => {

    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);

    const {isLoading, data, isError} = useQuery<LabResult[]>([GetLabResults, verifiedPatient?.patientId], () => {
        return getPatientsLabResults(verifiedPatient?.patientId, verifiedPatient?.departmentId);
    }, {enabled: !!verifiedPatient});

    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>;
    }

    return <div className={'w-full h-full'} >
        <h4 className='mb-10'>{t('external_access.lab_results.title')}</h4>
        <div className="flex flex-col body2 w-full">
            <div className='mb-10'>{t('external_access.lab_results.paragraph_1')}</div>
            <div className='mb-9 w-full lg:w-4/5'>
                <span>{`${t('external_access.lab_results.paragraph_2')} `}</span>
                <b>{`${t('external_access.lab_results.paragraph_3')} `}</b>
                <span>{t('external_access.lab_results.paragraph_4')}</span>
            </div>
            <LabResultSendAMessage />
            <div className="my-12">
                <div className="px-6 lab-results-grid head-row caption-caps">
                    <div className='truncate'>{t('external_access.lab_results.description')}</div>
                    <div className='truncate hidden sm:block'>{t('external_access.lab_results.provider_note')}</div>
                    <div className='truncate hidden sm:block'>{t('external_access.lab_results.ordered_by')}</div>
                    <div>{t('external_access.lab_results.collected')}</div>
                </div>
                {
                    (!data || !data.length) && !isLoading && <div className='subtitle3 text-center pt-4'>{t('external_access.lab_results.no_lab_results_found')}</div>
                }
                {
                    isLoading && <ThreeDots data-test-id='lab-results-loading' />
                }
                {
                    isError && <h6 className='text-danger'>{t('external_access.lab_results.error')}</h6>
                }
                {
                    data && data?.length > 0 && !isLoading &&
                    data.map(labResult =>
                        <div className="px-6 lab-results-grid data-row">
                            <LabResultListItem labResult={labResult} key={labResult.labResultId} />
                        </div>
                    )
                }
            </div>
        </div>
    </div>
}

export default withErrorLogging(LabResults);
