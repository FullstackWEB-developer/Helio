import PatientHeader from './components/patient-header';
import {useParams} from 'react-router';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsPatientError, selectPatient, selectPatientLoading} from './store/patients.selectors';
import {useTranslation} from 'react-i18next';
import {RecentPatient} from '@components/search-bar/models/recent-patient';
import patientUtils from './utils/utils';
import {addRecentPatient} from '@components/search-bar/store/search-bar.slice';
import PatientTabs from './components/patient-tabs';
import {getAllProviders, getLocations} from '@shared/services/lookups.service';
import ActivityPanel from './components/activity-panel';
import './patient-chart.scss';
import {getPatientById, getPatientSummary} from './services/patients.service';
import {useQuery} from 'react-query';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';
import {GetPatientSummary, OneMinute} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import NoSearchResults from '@components/search-bar/components/no-search-results';

interface PatientParams {
    patientId: string
}

const PatientChart = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {patientId} = useParams<PatientParams>();
    const loading = useSelector(selectPatientLoading);
    const error = useSelector(selectIsPatientError);
    const patient = useSelector(selectPatient);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

    useEffect(() => {
        dispatch(getPatientById(patientId, {includeInsuranceInfo: true}));
    }, [dispatch, patientId]);

    useEffect(() => {
        if (patient) {
            const recentPatient: RecentPatient = {
                patientId: patient.patientId,
                firstName: patient.firstName,
                lastName: patient.lastName,
                age: patientUtils.getAge(patient.dateOfBirth),
                dob: patientUtils.formatDob(patient.dateOfBirth)
            }
            dispatch(addRecentPatient(recentPatient));
            dispatch(getAllProviders());
            dispatch(getLocations());
        }
    }, [dispatch, patient]);

    const {
        isLoading: isSummaryLoading,
        data: patientChartSummary,
        refetch
    } = useQuery<PatientChartSummary, Error>([GetPatientSummary, patientId], () =>
        getPatientSummary(Number(patientId)),
        {
            staleTime: OneMinute
        }
    );

    const refreshPatient = async () => {
        setLastRefreshTime(new Date());
        dispatch(getPatientById(patientId, {includeInsuranceInfo: true}));
        await refetch();
    }


    if (isSummaryLoading || loading) {
        return <Spinner fullScreen />
    }
    if (error) {
        return <div hidden={!error} className={'p-4 text-red-500'}>{t('search.search_results.heading_error')}</div>
    }

    if (patient === undefined) {
        return <NoSearchResults />;
    }

    return (
        <div className='flex w-full'>
            <div className='w-2/3 overflow-y-auto'>
                {patientChartSummary &&
                    <>
                        <PatientHeader refreshPatient={refreshPatient} patientChartSummary={patientChartSummary} />
                        <PatientTabs lastRefreshTime={lastRefreshTime} patientChartSummary={patientChartSummary} patientId={patient.patientId} />
                    </>
                }

            </div>
            <div className='activity-panel border-l w-1/3'>
                <ActivityPanel />
            </div>
        </div>
    );
}

export default PatientChart;
