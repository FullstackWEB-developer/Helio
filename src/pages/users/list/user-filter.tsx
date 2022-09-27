import { TicketEnumValue } from "@pages/tickets/models/ticket-enum-value.model";
import { TicketOptionsBase } from "@pages/tickets/models/ticket-options-base.model";
import {
    getRoleWithState, getUserDepartmentsWithState, getUserInvitationStatusWithState,
    getUserJobTitleListWithState, getUserStatusWithState
} from "@shared/services/user.service";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Collapsible from '@components/collapsible/collapsible';
import Checkbox, { CheckboxCheckEvent } from "@components/checkbox/checkbox";
import { getLocations } from "@shared/services/lookups.service";
import {
    selectUserDepartments, selectUserFilters,
    selectUserInvitationStatusList, selectUserJobTitles, selectUserStatusList
} from "../store/users.selectors";
import { selectRoleList } from "@shared/store/lookups/lookups.selectors";
import { UserQueryFilter } from '../models/user-filter-query.model';
import { setUserFilters } from "../store/users.slice";
import { UserInvitationStatus } from "@shared/models";
import utils from "@shared/utils/utils";
import Button from '@components/button/button';
import CheckboxList from "@components/checkbox-list/checkbox-list";

const UserFilter = ({ isOpen }: { isOpen: boolean }) => {

    const { t } = useTranslation();
    const getClassNames = () => classNames({
        'w-80 transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto overflow-x-hidden relative': isOpen,
        'hidden': !isOpen
    });
    const dispatch = useDispatch();
    const userStatusList = useSelector(selectUserStatusList);
    const userInvitationStatusList = useSelector(selectUserInvitationStatusList);
    const userRoleList = useSelector(selectRoleList);
    const departments = useSelector(selectUserDepartments);
    const jobTitles = useSelector(selectUserJobTitles);
    const storedFilters = useSelector(selectUserFilters);
    const [formResetDateTime, setFormResetDateTime] = useState<Date>();
    const [collapsibleState, setCollapsibleState] = useState<{ [key: string]: boolean }>({});
    const allKey = '0';
    const { control, handleSubmit, reset, getValues, setValue } = useForm({});



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

    const GetCollapsibleCheckboxControl = (title: string, name: string, items: TicketOptionsBase[]) => {
        return <Collapsible title={title} isOpen={collapsibleState[name] || true} onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}>
            <CheckboxList items={items} name={name} control={control} resetDateTime={formResetDateTime} defaultValues={getDefaultCheckboxValues(name)}/>
        </Collapsible>
    }

    const setCheckBoxControl = (name: string, values: any[] | any | undefined) => {
        if (!values || !name) {
            return;
        }
        if (Array.isArray(values)) {
            values.forEach((value) => setValue(`${name}[${value}]`, { value: value, checked: true }));
        } else {
            setValue(`${name}[${values}]`, { value: values, checked: true });
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

    const jobTitleOptions = utils.convertStringArrayToOptions(jobTitles);
    const departmentOptions = utils.convertStringArrayToOptions(departments);
    const roleOptions = utils.convertStringArrayToOptions(userRoleList?.map(r => r.name));
    const userStatusOptions: TicketEnumValue[] = userStatusList?.map(s => ({ key: s.key, value: t(`users.list_section.status_${s.key === 1 ? 'enabled' : 'disabled'}`) }));
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
                const selectedInviteStatuses = getSelectedFromCheckbox(formValues.invites).map(inv => inv).join(';');
                if (selectedInviteStatuses && selectedInviteStatuses.length > 0) {
                    filters.invitationStatuses = selectedInviteStatuses;
                }
            }

            if (formValues.statuses && formValues.statuses.length > 0) {
                const selectedStatuses = getSelectedFromCheckbox(formValues.statuses).map(s => s).join(';');
                if (selectedStatuses && selectedStatuses.length > 0) {
                    filters.statuses = selectedStatuses;
                }
            }

        }
        if (storedFilters?.searchText && storedFilters.searchText.length > 0) {
            filters.searchText = storedFilters.searchText;
        }
        if (formValues.search !== undefined) {
            filters.searchText = formValues.search;
        }
        dispatch(setUserFilters({ filters, resetPagination: true }));
    }


    const resetForm = () => {
        const fieldsValue = getValues();
        setFormResetDateTime(new Date());
        const clearArray = (values: any) => Array.isArray(values) ? Array(values.length).fill('') : values;
        reset({
            statuses: clearArray(fieldsValue.statuses),
            invites: clearArray(fieldsValue.invites),
            roles: clearArray(fieldsValue.roles),
            departments: clearArray(fieldsValue.departments),
            titles: clearArray(fieldsValue.titles)
        });
        setFilters({
            search: ""
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

        const invitationStatuses = storedFilters?.invitationStatuses?.split(';')
            ?.map(option => option);

        const statuses = storedFilters?.statuses?.split(';')?.map(option => option);

        setCheckBoxControl('statuses', statuses);
        setCheckBoxControl('invites', invitationStatuses);
        setCheckBoxControl('departments', departmentFilters);
        setCheckBoxControl('titles', jobTitleFilters);
        setCheckBoxControl('roles', roleFilters);
        
        const getDefaultCheckboxValues = (name: string, values: any[] | any | undefined): void => {
            let items;
            let defaultValues;
            if(!values || values.length === 0){
                return;
            }
            switch (name) {
                case 'statuses':
                    items = convertEnumToOptions(userStatusOptions)
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(value.key) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultUserStatusValues(defaultValues);
                    break;
                case 'invites':
                    items = convertEnumToOptions(userInvitationStatusOptions)
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(value.key) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultInvitationStatusValues(defaultValues);
                    break;
                case 'departments':
                    items = departmentOptions
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(value.key) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultDepartmentValues(defaultValues);
                    break;
                case 'titles':
                    items = jobTitleOptions
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(value.key) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultJobTitleValues(defaultValues);
                    break;
                case 'roles':
                    items = roleOptions
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(value.key) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultRoleValues(defaultValues);
                    break;
            }
        }
        getDefaultCheckboxValues('statuses', statuses);
        getDefaultCheckboxValues('invites', invitationStatuses);
        getDefaultCheckboxValues('departments', departmentFilters);
        getDefaultCheckboxValues('titles', jobTitleFilters);
        getDefaultCheckboxValues('roles', roleFilters);
    }, [setValue, storedFilters]);

    const [defaultJobTitleValues, setDefaultJobTitleValues] = useState<boolean[]>(new Array(jobTitleOptions.length).fill(false));
    const [defaultDepartmentValues, setDefaultDepartmentValues] = useState<boolean[]>(new Array(departmentOptions.length).fill(false));
    const [defaultRoleValues, setDefaultRoleValues] = useState<boolean[]>(new Array(roleOptions.length).fill(false));
    const [defaultUserStatusValues, setDefaultUserStatusValues] = useState<boolean[]>(new Array(convertEnumToOptions(userStatusOptions).length).fill(false));
    const [defaultInvitationStatusValues, setDefaultInvitationStatusValues] = useState<boolean[]>(new Array(convertEnumToOptions(userInvitationStatusOptions).length).fill(false));

    const getDefaultCheckboxValues = (name: string): boolean[] => {
        let value;
        switch (name) {
            case 'statuses':
                value = defaultUserStatusValues
                break;
            case 'invites':
                value = defaultInvitationStatusValues
                break;
            case 'departments':
                value = defaultDepartmentValues;
                break;
            case 'titles':
                value = defaultJobTitleValues
                break;
            case 'roles':
                value = defaultRoleValues
                break;
        }
        return value;
    }

    return (
        <div className={getClassNames()}>
            <div className="pt-4 px-6 flex flex-col">
                <div className='flex-col items-center pb-2'>
                    <div className='py-3 subtitle'>{t('users.filters.title')}</div>
                    <div className='flex flex-row pb-3'>
                        <Button data-test-id='apply-button' className='cursor-pointer mr-4' label='users.filters.apply' buttonType='small' onClick={() => handleSubmit(setFilters)()} ></Button>
                        <Button data-test-id='reset-all-button' className='cursor-pointer' label='users.filters.reset_all' buttonType='secondary' onClick={() => resetForm()}></Button>
                    </div>
                </div>
                <form>
                    {GetCollapsibleCheckboxControl('users.filters.statuses', 'statuses', (convertEnumToOptions(userStatusOptions)))}
                    {GetCollapsibleCheckboxControl('users.filters.invites', 'invites', (convertEnumToOptions(userInvitationStatusOptions)))}
                    {GetCollapsibleCheckboxControl('users.filters.role', 'roles', (roleOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.department', 'departments', (departmentOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.job_title', 'titles', (jobTitleOptions))}
                </form>
            </div>
        </div>
    )
}

export default UserFilter;
