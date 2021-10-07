import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import './bulk-add.scss';
import Stepper from '@components/stepper';
import Button from "@components/button/button";
import BulkAddStepDescription from '../components/user-bulk-step-description';
import {useMutation, useQuery} from "react-query";
import {GetExternalUserList} from "@constants/react-query-constants";
import {getExternalUsersList, sendUserInvitation} from "@shared/services/user.service";
import {clearAllSelectedUsers, setBulkUsersPagination, setIsLocalBulkFilterOpen} from "../store/users.slice";
import {useDispatch, useSelector} from "react-redux";
import {
    selectAllSelectedUsersAssignedRole, selectBulkFilters,
    selectBulkUsersPaging, selectExternalUsersSelection
} from "../store/users.selectors";
import UserBulkSelectStep from '../components/users-bulk-select-step';
import Pagination from "@components/pagination/pagination";
import {InviteUserRequest, Paging} from "@shared/models";
import UserBulkPageCountSelect from "../components/user-bulk-page-count-select";
import {setGlobalLoading} from "@shared/store/app/app.slice";
import UserBulkActionStripe from '../components/user-bulk-action-stripe';
import BulkUserFilter from '../components/bulk-user-filter';
import BulkUserLocalPagination from "../components/bulk-user-local-pagination";
import UserBulkRoleStep from '../components/user-bulk-role-step';
import Radio from "@components/radio/radio";
import {BulkRolePicker} from "../models/bulk-role-picker.enum";
import {Option} from '@components/option/option';
import BulkUserLocalFilter from '../components/bulk-user-local-filter';
import UserBulkProviderStep from '../components/user-bulk-provider-step';
import UserBulkReviewStep from '../components/user-bulk-review-step';
import BulkSelectionOverview from '../components/bulk-selection-overview';
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";
import {BulkAddStep} from '../models/bulk-add-step.enum';
import {useHistory} from "react-router";
const BulkAddUser = () => {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const paginationProperties = useSelector(selectBulkUsersPaging);
    const allSelectedUsersAssignedARole = useSelector(selectAllSelectedUsersAssignedRole);
    const filters = useSelector(selectBulkFilters);
    const [currentStep, setCurrentStep] = useState(BulkAddStep.Selection);
    const numberOfSteps = 4;
    const history = useHistory();
    const goStepBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }
    const goStepForward = () => {
        if (currentStep < numberOfSteps) {
            if (currentStep === BulkAddStep.RolePicking && !allSelectedUsersAssignedARole) {
                dispatch(addSnackbarMessage({type: SnackbarType.Info, message: 'users.bulk_section.selected_users_no_roles', durationInSeconds: 5}));
                setRolePickerBehavior(BulkRolePicker.Individual);
                dispatch(setIsLocalBulkFilterOpen(true));
            }
            else {
                setCurrentStep(currentStep + 1);
            }

        }
    }

    const {data, isFetching, refetch} = useQuery([GetExternalUserList, filters],
        () => getExternalUsersList(filters, paginationProperties.page, paginationProperties.pageSize),
        {
            onSuccess: (data) => {
                dispatch(setBulkUsersPagination({
                    page: data.page,
                    pageSize: data.pageSize,
                    totalCount: data.totalCount,
                    totalPages: data.totalPages
                }));
            }
        });

    useEffect(() => {
        refetch();
    }, [paginationProperties?.page, paginationProperties?.pageSize]);

    useEffect(() => {
        dispatch(setGlobalLoading(isFetching));
    }, [isFetching]);

    const displayProperStepContent = () => {
        switch (currentStep) {
            case BulkAddStep.Selection:
                return <UserBulkSelectStep externalUsers={data?.results?.length > 0 ? data.results : []} />;
            case BulkAddStep.RolePicking:
                return <UserBulkRoleStep rolePickerBehavior={rolePickerBehavior} />
            case BulkAddStep.ProviderMapping:
                return <UserBulkProviderStep />
            case BulkAddStep.Review:
                return <UserBulkReviewStep handleInvitationMessageChange={(message) => setInvitationMessage(message)} invitationMessage={invitationMessage} />
            default:
                return null;
        }
    }

    const handlePageChange = (p: Paging) => {
        dispatch(setBulkUsersPagination(p));
    }

    const [invitationMessage, setInvitationMessage] = useState('');


    const deselectButtonAvailable = selectedExternalUsers?.length > 0 && currentStep === BulkAddStep.Selection;

    const determineDisabledNextButtonState = () => {
        switch (currentStep) {
            case BulkAddStep.Selection:
                return !deselectButtonAvailable;
            case BulkAddStep.RolePicking:
                return false;
            case BulkAddStep.ProviderMapping:
                return false;
            case BulkAddStep.Review:
                return sendUserInvitationsMutation.isLoading;
            default:
                return false;
        }
    }

    const [rolePickerBehavior, setRolePickerBehavior] = useState<BulkRolePicker>(BulkRolePicker.Group);
    const roleRadioOptions: Option[] = [
        {value: String(BulkRolePicker.Group), label: 'users.bulk_section.all_users_role'},
        {value: String(BulkRolePicker.Individual), label: 'users.bulk_section.invidual_user_role'}
    ];
    const onRolePickerChange = (value: string) => setRolePickerBehavior(Number(value));

    const userBulkActionStripeVisibility = () => {
        if (currentStep === BulkAddStep.RolePicking) {
            return rolePickerBehavior !== BulkRolePicker.Group;
        }
        return true;
    }

    const inviteUsers = () => {
        if (selectedExternalUsers.length > 0) {
            const requestBody: InviteUserRequest = {
                users: selectedExternalUsers.map(u => u.inviteUserModel),
                invitationMessage
            }
            sendUserInvitationsMutation.mutate(requestBody);
        }
    }

    const [inviteSuccess, setInviteSuccess] = useState(false);
    const successToastMessageDuration = 5;
    const sendUserInvitationsMutation = useMutation(sendUserInvitation,
        {
            onSuccess: () => {
                setInviteSuccess(true);                
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: 'users.add_section.invitation_sent_success',
                    durationInSeconds: successToastMessageDuration
                }));
                setTimeout(() => {
                    history.replace('/users');
                    dispatch(clearAllSelectedUsers());
                }, successToastMessageDuration * 1000);
            },
            onError: (error: any) => {
                const errorMessage = error.response && error.response.status === 400 ?
                    error.response.data.message :
                    'users.add_section.invitation_sent_error';

                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: errorMessage
                }));
            },
        });

    return (
        <div className='flex flex-auto h-full'>
            {
                currentStep !== 1 ? (rolePickerBehavior !== BulkRolePicker.Group || currentStep !== BulkAddStep.RolePicking ? <BulkUserLocalFilter currentStep={currentStep} /> : null)
                    : <BulkUserFilter />
            }
            <div className='p-6 w-full flex flex-col flex-grow'>
                <h5 className='pb-4'>{t('navigation.users_bulk')}</h5>
                <Stepper numberOfSteps={numberOfSteps} currentStep={currentStep} />
                <BulkAddStepDescription step={currentStep} />
                {
                    currentStep === BulkAddStep.Review &&
                    <BulkSelectionOverview />
                }
                {
                    currentStep === BulkAddStep.RolePicking &&
                    <Radio name='user-role-picking' className='flex flex-col pt-8'
                        defaultValue={String(rolePickerBehavior)}
                        value={String(rolePickerBehavior)}
                        items={roleRadioOptions} onChange={onRolePickerChange} />
                }
                {
                    paginationProperties?.totalCount > 0 && currentStep === BulkAddStep.Selection &&
                    <div className='flex justify-end items-baseline pb-3 h-14'>
                        <UserBulkPageCountSelect currentStep={currentStep} pageSize={paginationProperties.pageSize} />
                        <div className='w-72'>
                            <Pagination value={paginationProperties} onChange={handlePageChange} />
                        </div>
                    </div>
                }
                {
                    currentStep > BulkAddStep.Selection && (rolePickerBehavior !== BulkRolePicker.Group || currentStep !== BulkAddStep.RolePicking) &&
                    <BulkUserLocalPagination currentStep={currentStep} />
                }
                {userBulkActionStripeVisibility() && <div className='h-14'><UserBulkActionStripe currentStep={currentStep} /></div>}
                {
                    displayProperStepContent()
                }
                <div className='flex pt-7'>
                    {deselectButtonAvailable && <Button className='mr-8' label={'users.bulk_section.deselect_all'} buttonType='secondary-medium' onClick={() => {dispatch(clearAllSelectedUsers())}} />}
                    {currentStep > 1 && !inviteSuccess && <Button buttonType='secondary-medium' label={'common.back'} onClick={goStepBack} className='mr-8' />}
                    {!inviteSuccess && <Button buttonType='medium' label={currentStep !== BulkAddStep.Review ? 'common.continue' : 'users.bulk_section.add_users'}
                        onClick={currentStep !== BulkAddStep.Review ? goStepForward : inviteUsers} disabled={determineDisabledNextButtonState()}
                        isLoading={sendUserInvitationsMutation.isLoading} />}
                </div>
            </div>
        </div>

    );
}

export default BulkAddUser;