import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import patientUtils from '../../../../pages/patients/utils/utils';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useQuery} from 'react-query';
import {SearchPatient} from '@constants/react-query-constants';
import {getPatients} from '@shared/services/search.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectSearchTerm, selectSelectedType} from '../store/search-bar.selectors';
import {useHistory} from 'react-router';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import NoSearchResults from './no-search-results';
import {DefaultPagination, Paging} from '@shared/models';
import {Patient} from '@pages/patients/models/patient';
import Pagination from '@components/pagination/pagination';
import {setSearchTermDisplayValue} from '../store/search-bar.slice';
import {searchTypePatient} from '@components/search-bar/constants/search-type';

const PatientSearchResults = () => {
    const {t} = useTranslation();
    const searchTerm = useSelector(selectSearchTerm);
    const selectedType = useSelector(selectSelectedType);
    const history = useHistory();
    const dispatch = useDispatch();
    const pageSize = 10;
    const [paginationProperties, setPaginationProperties] = useState<Paging>({...DefaultPagination, pageSize});
    const [patientPagedResults, setPatientPagedResults] = useState<Patient[]>([]);

    const {isFetching, isError, data: patients} = useQuery([SearchPatient, searchTerm],
        () => getPatients(selectedType, searchTerm),
        {
            onSuccess: (data) => paginateResults(data),
            onError: () => setPatientPagedResults([])
        });


    useEffect(() => {
        dispatch(setGlobalLoading(isFetching));
        if (patients && patients.length === 1 && !isFetching) {
            handlePatientSelection(patients[0].patientId);
        }
    }, [patients, isFetching]);


    const handlePatientSelection = (patientId: number) => {
        dispatch(setSearchTermDisplayValue(''));
        history.push(`/patients/${patientId}`);
    }

    const paginateResults = (data: Patient[]) => {
        if (data && data.length > 1) {
            setPaginationProperties({
                pageSize: pageSize,
                page: 1,
                totalCount: data.length,
                totalPages: Math.ceil(data.length / pageSize),
            });
            setPatientPagedResults(data.slice(0, pageSize));
        }
    }

    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
        if (patients && patients.length) {
            setPatientPagedResults(patients.slice(p.pageSize * (p.page - 1),
                p.pageSize * p.page))
        }
    }

    const shouldDisplayPhoneHint = useMemo(() =>
    {
        if (searchTypePatient.phone !== selectedType) {
            return false;
        }
        const term = searchTerm.replace('(','')
            .replace(')','')
            .replace(' ','')
            .replace('-','');
        return term.length !== 10;
    },[searchTerm, selectedType])

    return (
        <>
            <div className="p-6 flex justify-between items-center">
                <h5>{t('search.search_results.heading_patient')}</h5>
                {paginationProperties.totalCount !== DefaultPagination.totalCount && paginationProperties.totalCount > 10
                    && patients && <Pagination value={paginationProperties} onChange={handlePageChange} />}
            </div>
            {patientPagedResults && patientPagedResults?.length > 0 && !isFetching &&
                <>
                    <div className="search-results-grid head-row col-template-patients caption-caps h-12 px-6">
                        <div className="truncate">{t('search.search_results.last_name')}</div>
                        <div className="truncate">{t('search.search_results.first_name')}</div>
                        <div className="truncate">{t('search.search_results.id')}</div>
                        <div className="truncate">{t('search.search_results.dob')}</div>
                        <div className="truncate">{t('search.search_results.ssn')}</div>
                        <div className="truncate">{t('search.search_results.department')}</div>
                        <div className="truncate"></div>
                    </div>
                    {
                        patientPagedResults.map(patient =>
                            <div key={patient.patientId} className="search-results-grid data-row h-10 col-template-patients px-6 body2">
                                <div className="truncate">{patient.lastName || ''}</div>
                                <div className="truncate">{patient.firstName || ''}</div>
                                <div className="truncate">{patient.patientId || ''}</div>
                                <div className="truncate">{patient.dateOfBirth ? patientUtils.formatDob(patient.dateOfBirth) : ''}</div>
                                <div className="truncate">{patient.ssn && patientUtils.displayPatientSsn(patient.ssn) ? patient.ssn : ''}</div>
                                <div className="truncate">{patient.currentDepartment || ''}</div>
                                <div>
                                    <SvgIcon type={Icon.View} className="cursor-pointer" fillClass="search-results-icon-fill"
                                        onClick={() => handlePatientSelection(patient.patientId)} />
                                </div>
                            </div>
                        )
                    }
                </>
            }
            {
                isError && <>
                    <NoSearchResults />
                    {shouldDisplayPhoneHint && <div className='pl-6 pt-8 body2-medium whitespace-pre-line'>{t('search.search_by_phone_no_result')}</div>}
                    {searchTypePatient.dateOfBirth === selectedType && <div className='pl-6 pt-8 body2-medium'>{t('search.search_date_format_not_correct')}</div>}
                    {searchTypePatient.patientId === selectedType && <div className='pl-6 pt-8 body2-medium'>{t('search.search_by_patient_id_no_result')}</div>}
                    {searchTypePatient.patientName === selectedType && <div className='pl-6 pt-8 body2-medium whitespace-pre-line'>{t('search.search_by_patient_name_no_result')}</div>}
                </>
            }
        </>

    );
}

export default PatientSearchResults;
