import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsLabResults } from './services/lab-results.service';
import {
    selectIsLabResultsLoading,
    selectLabResults,
    selectLabResultsError
} from './store/lab-results.selectors';
import Select, { Option } from '../../../shared/components/select/select';
import { useForm, Controller } from 'react-hook-form';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { selectVerifiedPatent } from '../../patients/store/patients.selectors';
import { resetLabResultsState } from './store/lab-results.slice';
import LabResultDetailItem from './components/lab-result-detail-item';
import { clearVerifiedPatient } from '../../patients/store/patients.slice';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import Button from '../../../shared/components/button/button';

interface LabResultOption extends Option {
    datetime: string,
    note: string
}

const LabResults = () => {

    const { t } = useTranslation();
    const { control } = useForm();
    const dispatch = useDispatch();
    const labResults = useSelector(selectLabResults);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const isLabResultsLoading = useSelector(selectIsLabResultsLoading);
    const labResultsError = useSelector(selectLabResultsError);

    useEffect(() => {
        if (verifiedPatient) {
            dispatch(getPatientsLabResults(verifiedPatient?.patientId, verifiedPatient?.departmentId));
        }
        return () => {
            dispatch(resetLabResultsState());
            dispatch(clearVerifiedPatient());
        }
    }, [dispatch, verifiedPatient]);

    const labResultsOptions: LabResultOption[] = labResults?.map(item => {
        return {
            value: item.labResultId.toString(),
            label: item.resultStatus,
            datetime: item.labResultDateTime,
            note: item.labResultNote
        };
    });

    const [selectedOption, setSelectedOption] =
        useState(labResultsOptions && labResultsOptions.length > 0 ? labResultsOptions[0] : null);

    const handleChange = (event: any) => {
        event.stopPropagation();
        const selectedLabResult =
            labResultsOptions ? labResultsOptions.find((o: LabResultOption) => o.value === event.target.value) : {} as any;

        setSelectedOption(selectedLabResult);
    }

    if (isLabResultsLoading) {
        return <ThreeDots data-test-id='lab-results-loading' />;
    }

    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>;
    }

    if (labResultsOptions && labResultsOptions.length < 1) {
        return <div data-test-id='lab-results-not-found'>{t('lab-results.no_lab_results_found')}</div>
    }

    const manageOptions = () => {
        if (selectedOption === null && labResultsOptions && labResultsOptions.length > 0) {
            setSelectedOption(labResultsOptions[0]);
        }
    }

    manageOptions();

    if (labResultsError) {
        return <div data-test-id='lab-results-error'>{t('lab-results.error')}</div>
    }

    return <div className={'w-96 py-4 mx-auto flex flex-col'} >
        <form hidden={labResultsOptions && labResultsOptions.length === 1}>
            <Controller
                name='lab-result-select'
                control={control}
                defaultValue={labResultsOptions ? labResultsOptions[0] : ''}
                render={() => (
                    <Select
                        data-test-id='lab-results-select'
                        className={'w-full'}
                        label={t('lab-results.label')}
                        options={labResultsOptions}
                        value={selectedOption ? selectedOption.value : ''}
                        onChange={handleChange}
                    />
                )}
            />
        </form>
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
            <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    {t('lab-results.detail_info')}
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    {t('lab-results.detail_info_description')}
                </p>
            </div>
            <div className='border-t border-gray-200'>
                <dl data-test-id='lab-results-detail-list'>
                    {
                        selectedOption ? <LabResultDetailItem item={selectedOption} /> : ''
                    }
                </dl>

                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                    <Button buttonType='secondary' label={t('common.download_pdf')} data-test-id='lab-results-download-pdf-button'/>
                    <Button label={t('common.print')} data-test-id='lab-results-print-button'/>
                </div>
            </div>
        </div>
    </div>
}

export default withErrorLogging(LabResults);
