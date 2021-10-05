import {TicketOptionsBase} from '@pages/tickets/models/ticket-options-base.model';
import utils from '@shared/utils/utils';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectExternalUsersSelection, selectIsLocalBulkFilterOpen, selectLocalBulkFilters} from '../store/users.selectors';
import Collapsible from '@components/collapsible/collapsible';
import {Controller, useForm} from 'react-hook-form';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {SelectExternalUser} from '@shared/models';
import {UserQueryFilter} from '../models/user-filter-query.model';
import {setLocalBulkFilters} from '../store/users.slice';
import {getRoleWithState} from '@shared/services/user.service';
import {selectRoleList} from '@shared/store/lookups/lookups.selectors';
import {BulkAddStep} from '../models/bulk-add-step.enum';

const BulkUserLocalFilter = ({currentStep}: {currentStep: BulkAddStep}) => {

    const [collapsibleState, setCollapsibleState] = useState<{[key: string]: boolean}>({});
    const {t} = useTranslation();
    const isLocalBulkFilterOpen = useSelector(selectIsLocalBulkFilterOpen);
    const getClassNames = () => classNames({
        'w-72 transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto relative': isLocalBulkFilterOpen,
        'hidden': !isLocalBulkFilterOpen
    });
    const allKey = '0';
    const {control, handleSubmit, reset, getValues, setValue} = useForm({});
    const selectedUsers = useSelector(selectExternalUsersSelection);
    const dispatch = useDispatch();
    const storedFilters = useSelector(selectLocalBulkFilters);

    const availableDepartments = selectedUsers
        .map((u: SelectExternalUser) => u.info?.department || '')
        .filter(d => !!d)
        .filter((v, i, a) => a.indexOf(v) === i) || [];

    const availableJobTitles = selectedUsers
        .map((u: SelectExternalUser) => u.info?.jobTitle || '')
        .filter(d => !!d)
        .filter((v, i, a) => a.indexOf(v) === i) || [];

    const departmentOptions = utils.convertStringArrayToOptions(availableDepartments);
    const jobTitleOptions = utils.convertStringArrayToOptions(availableJobTitles);

    const userRoleList = useSelector(selectRoleList);
    const roleOptions = utils.convertStringArrayToOptions(userRoleList.map(r => r.name));

    const unassignedRoleFilterOptions = utils.convertStringArrayToOptions(['users.filters.unassigned_role']);
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

    const getSelectedFromCheckbox = (items: CheckboxCheckEvent[]): string[] => {
        if (items) {
            const isAll = items.find(a => a && parseInt(a.value) === parseInt(allKey) && a.checked);
            if (!isAll) {
                return items.filter((a: CheckboxCheckEvent) => a.checked).map((b: CheckboxCheckEvent) => b.value);
            }
        }
        return [];
    }

    const setFilters = (formValues: any) => {
        let filters: UserQueryFilter = {};
        if (formValues) {

            if (formValues.departments && formValues.departments.length > 0) {
                const selectedDepartments = getSelectedFromCheckbox(formValues.departments);
                if (selectedDepartments && selectedDepartments.length > 0) {
                    filters.departments = selectedDepartments.map(d => departmentOptions.find(depOption => depOption.key === d)?.value).join(';');
                }
            }

            if (formValues.titles && formValues.titles.length > 0) {
                const selectedTitles = getSelectedFromCheckbox(formValues.titles);
                if (selectedTitles && selectedTitles.length > 0) {
                    filters.jobTitle = selectedTitles.map(t => jobTitleOptions.find(jt => jt.key === t)?.value).join(';');
                }
            }

            if (formValues.roles && formValues.roles.length > 0) {
                const selectedRoles = getSelectedFromCheckbox(formValues.roles);
                if (selectedRoles && selectedRoles.length > 0) {
                    filters.roles = selectedRoles.map(r => roleOptions.find(role => role.key === r)?.value).join(";");
                }
            }

            if (formValues.rolesUnassigned && formValues.rolesUnassigned.length > 0) {
                const selectedUnassignedRole = getSelectedFromCheckbox(formValues.rolesUnassigned);
                if (selectedUnassignedRole && selectedUnassignedRole.length > 0) {
                    filters.rolesUnassigned = selectedUnassignedRole.map(r => unassignedRoleFilterOptions.find(role => role.key === r)?.value).join(";");
                }
            }
        }

        if (storedFilters?.searchText && storedFilters.searchText.length > 0) {
            filters.searchText = storedFilters.searchText;
        }

        dispatch(setLocalBulkFilters({filters, resetPagination: true}));
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

    useEffect(() => {
        dispatch(getRoleWithState);
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
            ?.map(option => option?.key);

        const roleUnassignedFilters = storedFilters?.rolesUnassigned?.split(";")
            ?.map(role => unassignedRoleFilterOptions.find(r => r.value === role))
            ?.map(option => option?.key);

        setCheckBoxControl('departments', departmentFilters);
        setCheckBoxControl('titles', jobTitleFilters);
        setCheckBoxControl('roles', roleFilters);
        setCheckBoxControl('rolesUnassigned', roleUnassignedFilters);
    }, [setValue, storedFilters]);

    const resetForm = () => {
        const fieldsValue = getValues();
        const clearArray = (values: any) => Array.isArray(values) ? Array(values.length).fill('') : values;
        reset({
            roles: clearArray(fieldsValue.roles),
            departments: clearArray(fieldsValue.departments),
            titles: clearArray(fieldsValue.titles),
            rolesUnassigned: clearArray(fieldsValue.rolesUnassigned)
        });
    }

    return (
        <div className={getClassNames()}>
            <div className="pt-4 px-6 flex flex-col">
                <div className='flex justify-between h-14 items-center pb-2'>
                    <div className='subtitle'>{t('users.filters.title')}</div>
                    <div className='body2 cursor-pointer' onClick={() => handleSubmit(setFilters)()} >{t('users.filters.apply')}</div>
                    <div className='body2 cursor-pointer' onClick={() => resetForm()} >{t('users.filters.clear_all')}</div>
                </div>
                <form>
                    {GetCollapsibleCheckboxControl('users.filters.department', 'departments', addAllOption(departmentOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.job_title', 'titles', addAllOption(jobTitleOptions))}
                    {
                        currentStep > BulkAddStep.RolePicking &&
                        GetCollapsibleCheckboxControl('users.filters.role', 'roles', addAllOption(roleOptions))
                    }
                    {
                        currentStep === BulkAddStep.RolePicking &&
                        GetCollapsibleCheckboxControl('users.filters.role', 'rolesUnassigned', unassignedRoleFilterOptions)
                    }
                </form>
            </div>
        </div>
    );
}

export default BulkUserLocalFilter;