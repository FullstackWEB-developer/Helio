import React, {useEffect} from 'react';
import UserBulkPageCountSelect from "../components/user-bulk-page-count-select";
import {Paging} from "@shared/models";
import Pagination from "@components/pagination/pagination";
import {selectBulkUsersPaging, selectExternalUsersSelection, selectFilteredExternalUsersSelection, selectSelectedUsersLocalPagination} from '../store/users.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedUsersLocalPagination} from '../store/users.slice';
import {BulkAddStep} from '../models/bulk-add-step.enum';

const BulkUserLocalPagination = ({currentStep}: {currentStep: BulkAddStep}) => {

    const remotePaginationProperties = useSelector(selectBulkUsersPaging);
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filteredExternalUsers = useSelector(selectFilteredExternalUsersSelection);
    const localPaginationProperties = useSelector(selectSelectedUsersLocalPagination);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedUsersLocalPagination({
            page: 1,
            pageSize: remotePaginationProperties.pageSize,
            totalCount: selectedExternalUsers.length,
            totalPages: Math.ceil(selectedExternalUsers.length / remotePaginationProperties.pageSize)
        }));
    }, []);

    useEffect(() => {
        const length = filteredExternalUsers && filteredExternalUsers.length ? filteredExternalUsers.length : selectedExternalUsers.length;
        dispatch(setSelectedUsersLocalPagination({
            page: 1,
            pageSize: localPaginationProperties.pageSize,
            totalCount: length,
            totalPages: Math.ceil(length / localPaginationProperties.pageSize)
        }));
    }, [selectedExternalUsers.length, filteredExternalUsers, localPaginationProperties.pageSize]);

    const handlePageChange = (p: Paging) => {
        dispatch(setSelectedUsersLocalPagination(p));
    }

    return (
        <>
            {
                localPaginationProperties &&
                <div className='flex justify-end items-baseline pb-3 h-14'>
                    <UserBulkPageCountSelect currentStep={currentStep} pageSize={localPaginationProperties.pageSize} />
                    <div className='w-72'>
                        <Pagination value={localPaginationProperties} onChange={handlePageChange} />
                    </div>
                </div>
            }
        </>
    );

}

export default BulkUserLocalPagination;