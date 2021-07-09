import { Patient } from '@pages/patients/models/patient';
import { useSelector } from 'react-redux';
import { selectPatientList } from '@pages/patients/store/patients.selectors';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import patientUtils from '../../../../pages/patients/utils/utils';
import { useCallback, useEffect } from 'react';
import Button from '../../button/button';
import {selectIsSearchError} from '@components/search-bar/store/search-bar.selectors';
import {selectGlobalLoading} from '@shared/store/app/app.selectors';

const SearchResults = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const patients: Patient[] | undefined = useSelector(selectPatientList);
    const isError: boolean = useSelector(selectIsSearchError);
    const isGlobalLoading = useSelector(selectGlobalLoading);
    const select = useCallback((patient: Patient) => {
        history.push('/patients/' + patient.patientId);
    }, [history])

    useEffect(() => {
        if (patients?.length === 1) {
            select(patients[0]);
        }
    }, [select, patients])

    if (isGlobalLoading) {
        return <div/>;
    }

    const heading = (patients !== undefined && patients.length > 0)
        ? t('search.search_results.heading_list')
        : t('search.search_results.heading_empty');

    if (isError) {
        return <div className={'p-4 text-red-500'}>{t('search.search_results.heading_error')}</div>
    }

    return (
        <div>
            <div className={'p-4'}>
                <h5>{heading}</h5>
                <div className='grid grid-flow-row auto-rows-max md:auto-rows-min'>
                    <div hidden={patients === undefined || patients.length === 0}>
                        <div className='grid grid-flow-col auto-cols-max subtitle pt-8'>
                            <div className='p-2 w-60'>{t('search.search_results.patient_name')}</div>
                            <div className='p-2 w-32'>{t('search.search_results.date_of_birth')}</div>
                            <div className='p-2 w-16'>{t('search.search_results.action')}</div>
                        </div>
                    </div>
                    <div>
                        {
                            patients?.map(patient =>
                                <div className='grid grid-flow-col auto-cols-max' key={patient.patientId}>
                                    <div className='p-2 w-60'>{`${patient.firstName} ${patient.lastName}`}</div>
                                    <div className='p-2 w-32'>{patientUtils.formatDob(patient.dateOfBirth)}</div>
                                    <div className='p-2 w-16 text-center'>
                                        <Button buttonType='small' label={'search.search_results.select'} onClick={() => select(patient)}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SearchResults;
