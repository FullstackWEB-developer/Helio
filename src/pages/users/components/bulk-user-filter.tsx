import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectBulkFilters, selectExternalUserJobTitles, selectIsBulkUsersFilterOpen, selectUserExternalDepartments} from '../store/users.selectors';
import classNames from "classnames";
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import {getExternalDepartmentListWithState, getExternalJobTitleListWithState} from '@shared/services/user.service';
import {TicketOptionsBase} from '@pages/tickets/models/ticket-options-base.model';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Collapsible from '@components/collapsible/collapsible';
import utils from '@shared/utils/utils';
import {UserQueryFilter} from '../models/user-filter-query.model';
import {setBulkUserFilters} from '../store/users.slice';

const BulkUserFilter = () => {
    const {t} = useTranslation();
    const isBulkUserFilterOpen = useSelector(selectIsBulkUsersFilterOpen);
    const dispatch = useDispatch();
    const departments = useSelector(selectUserExternalDepartments);
    const jobTitles = useSelector(selectExternalUserJobTitles);
    
    const storedFilters = useSelector(selectBulkFilters);
    const [collapsibleState, setCollapsibleState] = useState<{[key: string]: boolean}>({});
    const allKey = '0';
    const {control, handleSubmit, reset, getValues, setValue} = useForm({});

    useEffect(() => {
        dispatch(getExternalDepartmentListWithState);
        dispatch(getExternalJobTitleListWithState);
    }, [dispatch]);

    const getClassNames = () => classNames({
        'w-72 transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto relative': isBulkUserFilterOpen,
        'hidden': !isBulkUserFilterOpen
    });

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

    const addAllOption = (list: any[]): TicketOptionsBase[] => {
        return [{
            key: allKey,
            value: t('common.all')
        }, ...list];
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

    const departmentOptions = utils.convertStringArrayToOptions(departments);
    const jobTitleOptions = utils.convertStringArrayToOptions(jobTitles);

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
        }

        if (storedFilters?.searchText && storedFilters.searchText.length > 0) {
            filters.searchText = storedFilters.searchText;
        }
        
        dispatch(setBulkUserFilters({filters, resetPagination: true}));
    }

    const resetForm = () => {
        const fieldsValue = getValues();
        const clearArray = (values: any) => Array.isArray(values) ? Array(values.length).fill('') : values;
        reset({
            departments: clearArray(fieldsValue.departments),
            titles: clearArray(fieldsValue.titles)
        });
    }

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

        setCheckBoxControl('departments', departmentFilters);
        setCheckBoxControl('titles', jobTitleFilters);        
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
                    {GetCollapsibleCheckboxControl('users.filters.department', 'departments', addAllOption(departmentOptions))}
                    {GetCollapsibleCheckboxControl('users.filters.job_title', 'titles', addAllOption(jobTitleOptions))}
                </form>
            </div>
        </div>
    );
}

export default BulkUserFilter;