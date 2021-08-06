import {TicketEnumValue} from "@pages/tickets/models/ticket-enum-value.model";
import {TicketOptionsBase} from "@pages/tickets/models/ticket-options-base.model";
import {
    getRoleWithState, getUserDepartmentsWithState, getUserInvitationStatusWithState,
    getUserJobTitleListWithState, getUserStatusWithState
} from "@shared/services/user.service";
import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Collapsible from '@components/collapsible/collapsible';
import Checkbox, {CheckboxCheckEvent} from "@components/checkbox/checkbox";
import {getLocations} from "@shared/services/lookups.service";
import {
    selectUserDepartments, selectUserFilters,
    selectUserInvitationStatusList, selectUserJobTitles, selectUserStatusList
} from "../store/users.selectors";
import {selectRoleList} from "@shared/store/lookups/lookups.selectors";
import {UserQueryFilter} from '../models/user-filter-query.model';
import {setUserFilters} from "../store/users.slice";
import {UserInvitationStatus} from "@shared/models";

const UserFilter = ({isOpen}: {isOpen: boolean}) => {

    const {t} = useTranslation();
    const getClassNames = () => classNames({
        'w-64 transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto relative': isOpen,
        'hidden': !isOpen
    });
    const dispatch = useDispatch();
    const userStatusList = useSelector(selectUserStatusList);
    const userInvitationStatusList = useSelector(selectUserInvitationStatusList);
    const userRoleList = useSelector(selectRoleList);
    const departments = useSelector(selectUserDepartments);
    const jobTitles = useSelector(selectUserJobTitles);
    const storedFilters = useSelector(selectUserFilters);
    const [collapsibleState, setCollapsibleState] = useState<{[key: string]: boolean}>({});
    const allKey = '0';
    const {control, handleSubmit, reset, getValues, setValue} = useForm({});



    const convertEnumToOptions = (items: TicketEnumValue[]): TicketOptionsBase[] => {
        if (items && items.length > 0) {
            return items.map(item => {
                return {
                    key: item.key.toString(),
                    value: item.value
                }
            })
        }
        return [];
    }

    const convertStringArrayToOptions = (array: string[]): TicketOptionsBase[] => {
        if (array && array.length > 0) {
            return array.map((dept, index) => {
                return {
                    key: String(index + 1),
                    value: dept
                }
            })
        }

        return [];
    }

    const addAllOption = (list: any[]): TicketOptionsBase[] => {
        return [{
            key: allKey,
            value: t('common.all')
        }, ...list];
    }

    const GetCollapsibleCheckboxControl = (title: string, name: string, items: TicketOptionsBase[]) => {
        return <Collapsible title={title} isOpen={collapsibleState[name] || true} onClick={(isCollapsed) => setCollapsibleState({...collapsibleState, [name]: isCollapsed})}>
            {
                items.map((item) => {
                    return (
                        <Controller
                            control={control}
                            name={`${name}[${item.key}]`}
                            defaultValue=''
                            key={item.key}
                            render={(props) => {
                                return (
                                    <Checkbox
                                        name={`${name}[${item.key}]`}
                                        ref={props.ref}
                                        checked={props.value?.checked ?? false}
                                        truncate={true}
                                        label={item.value}
                                        data-test-id={`${name}-checkbox-${item.key}`}
                                        value={item.key}
                                        onChange={(e: CheckboxCheckEvent) => {
                                            props.onChange(e);
                                        }}
                                    />
                                )
                            }}
                        />
                    );
                })
            }
        </Collapsible>
    }

    const setCheckBoxControl = (name: string, values: any[] | any | undefined) => {
        if (!values || !name) {
            return;
        }
        if (Array.isArray(values)) {
            values.forEach((value) => setValue(`${name}[${value}]`, {value: value, checked: true}));
        } else {
            setValue(`${name}[${values}]`, {value: values, checked: true});
        }
    }

    const getSelectedFromCheckbox = (items: CheckboxCheckEvent[]): string[] => {
        if (items) {
            const isAll = items.find(a => a && parseInt(a.value) === parseInt(allKey) && a.checked);
            if (!isAll) {
                return items.filter((a: CheckboxCheckEvent) => a.checked).map((b: CheckboxCheckEvent) => b.value);
            }
        }
        return [];
    }

    const jobTitleOptions = convertStringArrayToOptions(jobTitles);
    const departmentOptions = convertStringArrayToOptions(departments);
    const roleOptions = convertStringArrayToOptions(userRoleList.map(r => r.name));
    const userStatusOptions: TicketEnumValue[] = userStatusList?.map(s => ({key: s.key, value: t(`users.list_section.status_${s.key === 1 ? 'enabled' : 'disabled'}`)}));
    const displayInvitationStatus = (invitationStatus: UserInvitationStatus): string => {
        switch (invitationStatus) {
            case UserInvitationStatus.Accepted:
                return t('users.list_section.invitation_accepted');
            case UserInvitationStatus.Sent:
                return t('users.list_section.invitation_sent');
            default:
                return t('users.list_section.invitation_no_invite');
        }
    }
    const userInvitationStatusOptions: TicketEnumValue[] = userInvitationStatusList?.map(inviteStatus => ({
        key: inviteStatus.key,
        value: displayInvitationStatus(inviteStatus.key)
    }));

    const setFilters = (formValues: any) => {
        let filters: UserQueryFilter = {};
        if (formValues) {
            if (formValues.titles && formValues.titles.length > 0) {
                const selectedTitles = getSelectedFromCheckbox(formValues.titles);
                if (selectedTitles && selectedTitles.length > 0) {
                    filters.jobTitle = selectedTitles.map(t => jobTitleOptions.find(jt => jt.key === t)?.value).join(';');
                }
            }

            if (formValues.departments && formValues.departments.length > 0) {
                const selectedDepartments = getSelectedFromCheckbox(formValues.departments);
                if (selectedDepartments && selectedDepartments.length > 0) {
                    filters.departments = selectedDepartments.map(d => departmentOptions.find(depOption => depOption.key === d)?.value).join(';');
                }
            }

            if (formValues.roles && formValues.roles.length > 0) {
                const selectedRoles = getSelectedFromCheckbox(formValues.roles);
                if (selectedRoles && selectedRoles.length > 0) {
                    filters.roles = selectedRoles.map(r => roleOptions.find(role => role.key === r)?.value).join(";");
                }
            }

            if (formValues.invites && formValues.invites.length > 0) {
                const selectedInviteStatuses = getSelectedFromCheckbox(formValues.invites).map(inv => inv).join(',');
                if (selectedInviteStatuses && selectedInviteStatuses.length > 0) {
                    filters.invitationStatuses = selectedInviteStatuses;
                }
            }

            if (formValues.statuses && formValues.statuses.length > 0) {
                const selectedStatuses = getSelectedFromCheckbox(formValues.statuses).map(s => s).join(',');
                if (selectedStatuses && selectedStatuses.length > 0) {
                    filters.statuses = selectedStatuses;
                }
            }

        }
        if (storedFilters?.searchText && storedFilters.searchText.length > 0) {
            filters.searchText = storedFilters.searchText;
        }
        dispatch(setUserFilters({filters, resetPagination: true}));
    }


    const resetForm = () => {
        const fieldsValue = getValues();
        const clearArray = (values: any) => Array.isArray(values) ? Array(values.length).fill('') : values;
        reset({
            statuses: clearArray(fieldsValue.statuses),
            invites: clearArray(fieldsValue.invites),
            roles: clearArray(fieldsValue.roles),
            departments: clearArray(fieldsValue.departments),
            titles: clearArray(fieldsValue.titles)
        });
    }

    useEffect(() => {
        dispatch(getUserStatusWithState);
        dispatch(getUserInvitationStatusWithState);
        dispatch(getRoleWithState);
        dispatch(getLocations());
        dispatch(getUserDepartmentsWithState);
        dispatch(getUserJobTitleListWithState);
    }, [dispatch]);

    useEffect(() => {
        if (!storedFilters) {
            resetForm();
        }
        const departmentFilters = storedFilters?.departments?.split(";")
            ?.map(departmentVal => departmentOptions.find(d => d.value === departmentVal))
            ?.map(option => option?.key);

        const jobTitleFilters = storedFilters?.jobTitle?.split(";")
            ?.map(jobTitle => jobTitleOptions.find(jt => jt.value === jobTitle))
            ?.map(option => option?.key);

        const roleFilters = storedFilters?.roles?.split(";")
            ?.map(role => roleOptions.find(r => r.value === role))
            ?.map(option => option?.key)

        const invitationStatuses = storedFilters?.invitationStatuses?.split(',')
            ?.map(option => option);

        const statuses = storedFilters?.statuses?.split(',')?.map(option => option);

        setCheckBoxControl('statuses', statuses);
        setCheckBoxControl('invites', invitationStatuses);
        setCheckBoxControl('departments', departmentFilters);
        setCheckBoxControl('titles', jobTitleFilters);
        setCheckBoxControl('roles', roleFilters);
    }, [setValue, storedFilters]);

    return (
        <div className={getClassNames()}>
            <div className="pt-4 px-6 flex flex-col">
                <div className='flex justify-between h-14 items-center pb-2'>
                    <div className='subtitle'>{t('users.filters.title')}</div>
                    <div className='body2 cursor-pointer' onClick={() => handleSubmit(setFilters)()}>{t('users.filters.apply')}</div>
                    <div className='body2 cursor-pointer' onClick={() => resetForm()}>{t('users.filters.clear_all')}</div>
                </div>
                <form>
                    {GetCollapsibleCheckboxControl('users.filters.statuses', 'statuses', addAllOption(convertEnumToOptions(userStatusOptions)))}
                    {GetCollapsibleCheckboxControl('users.filters.invites', 'invites', addAllOption(convertEnumToOptions(userInvitationStatusOptions)))}
                    {GetCollapsibleCheckboxControl('users.filters.role', 'roles', addAllOption(roleOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.department', 'departments', addAllOption(departmentOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.job_title', 'titles', addAllOption(jobTitleOptions))}
                </form>
            </div>
        </div>
    )
}

export default UserFilter;