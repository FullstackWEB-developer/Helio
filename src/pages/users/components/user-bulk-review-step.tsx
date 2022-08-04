import TextArea from '@components/textarea/textarea';
import {SelectExternalUser} from '@shared/models';
import {selectProviderList} from '@shared/store/lookups/lookups.selectors';
import utils from '@shared/utils/utils';
import React, {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectExternalUsersSelection, selectFilteredExternalUsersSelection, selectLocalBulkFilters, selectSelectedUsersLocalPagination} from '../store/users.selectors';
import {setBulkLocalUsersFiltered, setLocalBulkFilters} from '../store/users.slice';

const UserBulkReviewStep = ({handleInvitationMessageChange, invitationMessage}: {invitationMessage: string, handleInvitationMessageChange: (message: string) => void}) => {
    const {t} = useTranslation();

    const localFilters = useSelector(selectLocalBulkFilters);
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filteredExternalUsers = useSelector(selectFilteredExternalUsersSelection);
    const localPaginationProperties = useSelector(selectSelectedUsersLocalPagination);
    const usersSlice = [localPaginationProperties.pageSize * (localPaginationProperties.page - 1),
    localPaginationProperties.pageSize * localPaginationProperties.page];
    const dispatch = useDispatch();

    const providers = useSelector(selectProviderList);
    const providerOptions = useMemo(() => utils.parseOptions(providers,
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString()
    ), [providers]);


    const displayList = () => {
        return localFilters && Object.keys(localFilters).length > 0 ?
            (filteredExternalUsers && filteredExternalUsers.length > 0 ? filteredExternalUsers : []) :
            selectedExternalUsers;
    }

    const usersToDisplay = displayList();

    useEffect(() => {
        dispatch(setLocalBulkFilters({filters: undefined, resetPagination: true}));
        dispatch(setBulkLocalUsersFiltered(false));
    }, []);

    return (
        <div className='w-full overflow-y-auto relative'>
            <div className='bulk-user-grid col-template-step-4 head-row caption-caps h-12 px-4'>
                <div className='truncate'>{t('users.bulk_section.name')}</div>
                <div className='truncate'>{t('users.bulk_section.department')}</div>
                <div className='truncate'>{t('users.bulk_section.job_title')}</div>
                <div className='truncate'>{t('users.bulk_section.role')}</div>
                <div className='truncate'>{t('users.bulk_section.ehr_mapping')}</div>
            </div>
            {
                usersToDisplay.length > 0 ?
                    usersToDisplay?.slice(usersSlice[0], usersSlice[1]).map((u: SelectExternalUser) => (
                        <div key={u.id} className='bulk-user-grid data-row col-template-step-4 h-14 px-4 body2'>
                            <div className='flex flex-col truncate'>
                                <span>{u.info?.displayName || ''}</span>
                                {u.info?.mail && <span className='body3-medium'>{u.info?.mail}</span>}
                            </div>
                            <div className='truncate'>{u.info?.department || ''}</div>
                            <div className='truncate'>{u.info?.jobTitle || ''}</div>
                            <div>
                                {u.inviteUserModel?.roles && u.inviteUserModel?.roles.length > 0 ? u.inviteUserModel.roles[0] : ''}
                            </div>
                            <div>
                                {u.inviteUserModel?.providerId ? providerOptions.find(p => p.value === u.inviteUserModel.providerId)?.label
                                    : t('users.bulk_section.undefined_mapping')}
                            </div>
                        </div>
                    )) : <div className='subtitle3-small w-full text-center mt-5'>{t('users.bulk_section.no_filter_results')}</div>
            }

            <div className='flex flex-col'>
                <span className='subtitle2 pb-1 pt-10'>{t('users.bulk_section.personalized_message')}</span>
                <div className='h-24 w-full md:w-2/3 body2 flex'>
                    <TextArea overwriteDefaultContainerClasses={true} textareaContainerClasses='w-full h-full py-2 px-4'
                        onChange={handleInvitationMessageChange} value={invitationMessage} className='w-full h-full' resizable={false} rows={2} minRows={2} maxRows={2} />
                </div>
            </div>
        </div>
    );
}

export default UserBulkReviewStep;