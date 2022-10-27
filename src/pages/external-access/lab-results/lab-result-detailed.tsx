import {GetLabResultDetail} from '@constants/react-query-constants';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {AxiosError} from 'axios';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {getPatientLabResultDetail} from './services/lab-results.service';
import {LabResultDetail} from './models/lab-result-detail.model';
import LabResultDetailHeader from './components/lab-result-detail-header';
import LabResultDetailProviderComment from './components/lab-result-detail-provider-comment';
import './lab-results.scss';
import LabResultSendAMessage from './components/lab-result-send-a-message';
import utils from '@shared/utils/utils';
import LabResultObservationItem from './components/lab-result-observation-item';
import LabResultsSection from './components/lab-results-section';
import {LabResultDetailPage} from './models/lab-result-detail-page.model';
import LabResultDetailPageImage from './components/lab-result-detail-page-image';
import Spinner from '@components/spinner/Spinner';
import { isMobile } from 'react-device-detect';

const LabResultDetailed = () => {
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const {labResultId} = useParams<{labResultId: string}>();
    const {t} = useTranslation();
    const {isFetching, data, isError, isLoading} = useQuery<LabResultDetail, AxiosError>([GetLabResultDetail, verifiedPatient?.patientId, labResultId],
        () => getPatientLabResultDetail(verifiedPatient?.patientId, Number(labResultId)),
        {
            enabled: !!verifiedPatient && !!labResultId
        }
    );

    if (isError) {
        return <h6 className='text-danger'>{t('external_access.lab_results.error')}</h6>;
    }
    if (isFetching || isLoading || !data) {
        return <Spinner fullScreen />;
    }

    return (
        data ?
            <div className='w-full h-full pt-6 without-default-padding'>
                <LabResultDetailHeader labResultDetail={data} />
                <LabResultDetailProviderComment labResultDetail={data} />
                <div className='mt-8 mb-6'>
                    <LabResultSendAMessage labResult={data} />
                </div>
                <div className="flex justify-between py-5 pr-6">
                    <div className='subtitle'>{t('external_access.lab_results.lab_results')}</div>
                    {
                        data.createdDateTime && utils.checkIfDateIsntMinValue(data.createdDateTime) &&
                        <div className='flex body2'>
                            <span className='lab-results-grayed-label'>{t('external_access.lab_results.received')}&nbsp;</span>
                            <span>{utils.formatDateShortMonth(data.createdDateTime.toString())}</span>
                        </div>
                    }
                </div>
                {   !isMobile &&
                    <>
                        <div className="px-4 observations-grid caption-caps head-row">
                            <div className='truncate'>{t('external_access.lab_results.analytes')}</div>
                            <div className='truncate'>{t('external_access.lab_results.value')}</div>
                            <div className='truncate'>{t('external_access.lab_results.ref_range')}</div>
                            <div className='truncate'>{t('external_access.lab_results.units')}</div>
                        </div>
                    </>
                }
                {
                    data.observations && data.observations.length > 0 ? data.observations.map((observation, index) => <LabResultObservationItem isMobile={isMobile} index={index + 1} totalCount={2} observation={observation} key={observation.observationIdentifier} />)
                        : <div className='pt-4 text-center subtitle3'>{t('external_access.lab_results.no_observations')}</div>
                }
                <div className='mt-8' />
                {
                    data.pages && data.pages.length > 0 &&
                    data.pages.map((page: LabResultDetailPage) => <LabResultDetailPageImage key={page.pageId} labResultId={data.labResultId} page={page} />)
                }
                <div className="mt-8" />
                <LabResultsSection title={t('external_access.lab_results.test_information')}>
                    <div className={`grid gap-x-8 body2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        <div>
                            <span className='lab-results-grayed-label'>
                                {t('external_access.lab_results.patient_name')}
                            </span>
                            {`${verifiedPatient.firstName || ''} ${verifiedPatient.lastName || ''}`}
                        </div>
                        <div><span className='lab-results-grayed-label'>{t('external_access.lab_results.test')}</span>
                            {data.description || t('common.not-_available')}
                        </div>
                        <div>
                            <span className='lab-results-grayed-label'>{t('external_access.lab_results.dob')}</span>
                            {verifiedPatient?.dateOfBirth ? utils.formatDateShortMonth(verifiedPatient.dateOfBirth.toString()) : t('common.not-available')}
                        </div>
                        <div>
                            <span className='lab-results-grayed-label'>{t('external_access.lab_results.laboratory')}</span>
                            {data.performingLabName || t('common.not_available')}
                        </div>
                        <div />
                        <div>
                            <span className='lab-results-grayed-label'>{t('external_access.lab_results.specimen_id')}</span>
                            {data.labResultId}
                        </div>
                        <div />
                        <div>
                            <span className='lab-results-grayed-label'>
                                {t('external_access.lab_results.collected')}:&nbsp;
                            </span>
                            {data.encounterDate && utils.checkIfDateIsntMinValue(data.encounterDate) ? utils.formatDateShortMonth(data.encounterDate.toString()) : t('common.not-available')}
                        </div>
                        <div />
                        <div>
                            <span className='lab-results-grayed-label'>
                                {t('external_access.lab_results.received')}:&nbsp;
                            </span>
                            {data.createdDateTime && utils.checkIfDateIsntMinValue(data.createdDateTime) ? utils.formatDateShortMonth(data.createdDateTime.toString()) : t('common.not-available')}
                        </div>
                    </div>
                </LabResultsSection>
                <LabResultsSection title={t('external_access.lab_results.note')}>
                    <div className='subtitle2'>
                        <b>{t('external_access.lab_results.note_paragraph_1')}</b>&nbsp;
                        {t('external_access.lab_results.note_paragraph_2')}
                    </div>
                </LabResultsSection>
            </div> : null
    )
}
export default withErrorLogging(LabResultDetailed);
