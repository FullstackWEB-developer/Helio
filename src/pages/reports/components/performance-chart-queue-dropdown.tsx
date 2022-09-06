import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';
import {Controller, useForm} from 'react-hook-form';
import Radio from '@components/radio/radio';
import {PerformanceChartViewType} from '@shared/models/performance-chart-view-type.enum';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Button from '@components/button/button';
import {useComponentVisibility} from '@shared/hooks';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TicketOptionsBase} from '@pages/tickets/models/ticket-options-base.model';
import {usePopper} from 'react-popper';
import {Option} from '@components/option/option';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useDispatch} from 'react-redux';
import {QueueLabels} from '@pages/reports/components/performance-charts-graphic';

const dropdownItems = [{
    value: "reports.performance_charts_page.top_5_by_volume",
    key: PerformanceChartViewType.Top5ByVolume
},{
    value: "reports.performance_charts_page.custom",
    key: PerformanceChartViewType.Custom
}] as TicketOptionsBase[];

export interface PerformanceChartQueueDropdownProps {
    onQueuesSelected: (queues: string[] | null) => void;
    queueLabels: QueueLabels[] | undefined;
    type: 'voice' | 'chat';
}

const PerformanceChartQueueDropdown = ({onQueuesSelected, queueLabels, type} : PerformanceChartQueueDropdownProps) => {
    const {t} = useTranslation();
    const [displayTypeDropdown, setDisplayTypeDropdown, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState<string | undefined>(dropdownItems && dropdownItems[0].key);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<string | undefined>(dropdownItems && dropdownItems[0].value);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const { control, handleSubmit } = useForm({});
    const dispatch = useDispatch();
    const checkboxName = `report-chart-radio-button-list-controller_${type}`;
    const { styles, attributes, update } = usePopper(elementRef.current, popper, {
        placement: 'bottom-start',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 8],
            },
        }]
    });

    useEffect(() => {
        if (displayTypeDropdown && update) {
            update().then();
        }
    }, [update, displayTypeDropdown, selectedDropdownItem, selectedDropdownValue]);




    const convertOptionsToRadio = (items: TicketOptionsBase[]): Option[] => {
        return items.map(item => {
            return {
                value: item.key,
                label: item.value
            } as Option
        })
    }

    const apply = (form: any) => {
        if(form[checkboxName] === PerformanceChartViewType.Top5ByVolume){
            setSelectedDropdownItem(dropdownItems[0].value);
            onQueuesSelected([]);
            setDisplayTypeDropdown(false);
        }else{
            let selectedQueueNames: string[] = [];
            for (const key in form) {
                if(key !== checkboxName){
                    if(form[key].checked){
                        selectedQueueNames.push(key);
                    }
                }
            }
            if(selectedQueueNames.length === 0){
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'reports.performance_charts_page.selected_error_0'
                }));
            }else if(selectedQueueNames.length > 5){
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'reports.performance_charts_page.selected_error_5'
                }));
            }else{
                setSelectedDropdownItem(dropdownItems[1].value);
                setDisplayTypeDropdown(false);
            }
            onQueuesSelected(selectedQueueNames);
        }
    }


    const dropdownSelected = (id: string) => {
        if(id === PerformanceChartViewType.Top5ByVolume){
            handleSubmit(apply)()
        }
        setSelectedDropdownValue(id);
    }

    return   <div className='relative z-10' ref={elementRef}>
            <div onClick={() => setDisplayTypeDropdown(!displayTypeDropdown)}
                 className='flex flex-row items-center cursor-pointer'>
                <div className='body2'>{selectedDropdownItem && t(selectedDropdownItem)}</div>
                <div className='pl-2'>
                    <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                             className='icon-medium' fillClass='dashboard-dropdown-arrows' />
                </div>
            </div>
            <div className={classnames('z-10 pb-6 pt-8 px-4 bg-white dropdown-body w-80', { 'hidden': !displayTypeDropdown })}
                 style={styles.popper}
                 ref={setPopper}
                 {...attributes.popper}>
                <Controller
                    control={control}
                    name={checkboxName}
                    defaultValue={selectedDropdownValue}
                    render={(props) => {
                        return (<Radio
                                name={checkboxName}
                                truncate={true}
                                key={type}
                                ref={props.ref}
                                data-test-id={`report-chart-radio-button-list`}
                                labelClassName='ticket-filter-radio'
                                value={props.value}
                                items={convertOptionsToRadio(dropdownItems)}
                                onChange={(e: string) => {
                                    props.onChange(e);
                                    dropdownSelected(e);
                                }}
                            />
                        )
                    }}
                />
                {
                    selectedDropdownValue === PerformanceChartViewType.Custom && <>
                    <div className='subtitle2 my-4'>{t('reports.performance_charts_page.select_up_to_5_queues')}</div>
                        <div className='overflow-y-auto max-h-56'>
                            {
                                queueLabels?.map((item) => {
                                    return <Controller
                                        control={control}
                                        name={item.queueName}
                                        defaultValue={''}
                                        key={item.queueName}
                                        render={(props) => {
                                            return (
                                                <Checkbox
                                                    name={`[${item.queueName}]`}
                                                    ref={props.ref}
                                                    checked={props.value?.checked ?? false}
                                                    truncate={true}
                                                    label={item.queueName}
                                                    data-test-id={`checkbox-${item.queueName}`}
                                                    value={item.queueName}
                                                    onChange={(e: CheckboxCheckEvent) => {
                                                        props.onChange(e);
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                })
                            }
                        </div>
                        <div className='flex justify-end mt-10 space-x-6'>
                            <Button label='common.cancel' buttonType='secondary' onClick={() => setDisplayTypeDropdown(false)} />
                            <Button
                                type='submit'
                                buttonType='small'
                                label='common.update'
                                onClick={() => handleSubmit(apply)()}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
}

export default PerformanceChartQueueDropdown;
