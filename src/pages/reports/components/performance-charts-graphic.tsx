import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import { PerformanceChartDisplayUnit } from '../models/performance-chart.model';
import PerformanceVolumeChart from './performance-volume.chart';
import { useEffect, useState } from 'react';
import Dropdown, { DropdownItemModel, DropdownModel } from '@components/dropdown';
import { useComponentVisibility } from '@shared/hooks';
import SvgIcon, { Icon } from '@components/svg-icon';
import { usePopper } from 'react-popper';
import { TicketOptionsBase } from '@pages/tickets/models/ticket-options-base.model';
import { Controller, useForm } from 'react-hook-form';
import Radio from '@components/radio/radio';
import { Option } from '@components/option/option';
import Checkbox, { CheckboxCheckEvent } from '@components/checkbox/checkbox';
import Button from '@components/button/button';
import { useDispatch } from 'react-redux';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { PerformanceChartViewType } from '@shared/models/performance-chart-view-type.enum';
export interface PerformanceChartsGraphicProps {
    data: { queueName: string; queueData: PerformanceChartDisplayUnit[]; }[]
    title: string,
    wrapperClass?: string
}

export interface QueueLabels {
    queueName: string
    queueValue: number,
}

const dropdownItems = [{
    value: "reports.performance_charts_page.top_5_by_volume",
    key: PerformanceChartViewType.Top5ByVolume
},{
    value: "reports.performance_charts_page.custom",
    key: PerformanceChartViewType.Custom
}] as TicketOptionsBase[]

const PerformanceChartsGraphic = ({data, title, wrapperClass}: PerformanceChartsGraphicProps) => {
    const {t} = useTranslation();
    const [displayTypeDropdown, setDisplayTypeDropdown, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<string | undefined>(dropdownItems && dropdownItems[0].value);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState<string | undefined>(dropdownItems && dropdownItems[0].key);
    const [queueLabels, setQueueLabels] = useState<QueueLabels[] | undefined>(undefined);
    const [selectedQueueNames, setSelectedQueueNames] = useState<string[] | null >([]);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const { control, handleSubmit } = useForm({});
    const dispatch = useDispatch();
    const { styles, attributes, update } = usePopper(elementRef.current, popper, {
        placement: 'bottom-start',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 0],
            },
        }]
    });
    useEffect(() => {
        if (displayTypeDropdown && update) {
            update().then();
        }
    }, [update, displayTypeDropdown, selectedDropdownItem, selectedDropdownValue]);
    useEffect(() => {
        setQueueLabels(data.map(item => {
            return {
                queueName: item.queueName,
                queueValue: item.queueData.reduce((n, {value}) => n + value, 0)
            }
        }))
    }, [data]);
    const convertOptionsToRadio = (items: TicketOptionsBase[]): Option[] => {
        return items.map(item => {
            return {
                value: item.key,
                label: item.value
            } as Option
        })
    }

    const dropdownSelected = (id: string) => {
        if(id === PerformanceChartViewType.Top5ByVolume){
            handleSubmit(apply)()
        }
        setSelectedDropdownValue(id);
    }

    const apply = (form: any) => {
        if(form['report-chart-radio-button-list-controller'] === PerformanceChartViewType.Top5ByVolume){
            setSelectedDropdownItem(dropdownItems[0].value);
            setSelectedQueueNames([]);
            setDisplayTypeDropdown(false);
        }else{
            let selectedQueueNames: string[] = [];
            for (const key in form) {
                if(key !== 'report-chart-radio-button-list-controller'){
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
            setSelectedQueueNames(selectedQueueNames);
        }
    }

    const getNumberBadge = (item: any) => {
        return <div className='items-center justify-center'>
            <div className='body3-small flex items-center justify-center'>
                {item.queueName}
            </div>
            <h4 className='flex items-center justify-center mt-2'>
                {item.queueValue}
            </h4>
        </div>
    }

    if (!data || data.length === 0) {
        return <div className={`${wrapperClass} p-4 bg-white rounded-lg`}>
        <div className='h7'>{t(title)}</div>
        <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    </div>
    }

    return <div className={`${wrapperClass} p-4 bg-white rounded-lg`}>
        <div className='flex justify-between'>
                <div className='h7'>{t(title)}</div>
                {
                    <div className='relative z-10' ref={elementRef}>
                        <div onClick={() => setDisplayTypeDropdown(!displayTypeDropdown)}
                            className='flex flex-row items-center cursor-pointer'>
                            <div>{selectedDropdownItem && t(selectedDropdownItem)}</div>
                            <div className='pl-2'>
                                <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                    className='icon-medium' fillClass='dashboard-dropdown-arrows' />
                            </div>
                        </div>
                        <div className={classnames('z-10 py-4 px-4 bg-white dropdown-body', { 'hidden': !displayTypeDropdown })}
                                style={styles.popper}
                                ref={setPopper}
                                {...attributes.popper}>
                                <Controller
                                    control={control}
                                    name={'report-chart-radio-button-list-controller'}
                                    defaultValue={selectedDropdownValue}
                                    render={(props) => {
                                        return (<Radio
                                            name={'report-chart-radio-button-list'}
                                            truncate={true}
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
                                    selectedDropdownValue === PerformanceChartViewType.Custom && <div className='subtitle2 my-4'>{t('reports.performance_charts_page.select_up_to_5_queues')}</div>
                                }
                                {
                                    selectedDropdownValue === PerformanceChartViewType.Custom && <div className='overflow-y-auto max-h-56'>
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
                                }
                                {
                                    selectedDropdownValue === PerformanceChartViewType.Custom && <div className='flex justify-end mt-10'>
                                    <Button label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setDisplayTypeDropdown(false)} />
                                    <Button
                                        type='submit'
                                        buttonType='small'
                                        label='common.apply'
                                        onClick={() => handleSubmit(apply)()}
                                    />
                                </div>
                                }
                            </div>
                    </div>
                }
            </div>
        <div className='mt-12 ml-12 mb-4 subtitle2'>{t(title)}</div>
        <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>
            <PerformanceVolumeChart data={data} selectedQueues={selectedQueueNames}/>
        </div>
        <div className='w-full px-16 space-y-4 justify-around items-center flex'>
            {
                selectedQueueNames && selectedQueueNames.length > 0 ? queueLabels?.filter(x => selectedQueueNames?.includes(x.queueName)).map(item => { return getNumberBadge(item) }) : queueLabels?.map(item => { return getNumberBadge(item) })
            }
        </div>
    </div>;
}

export default PerformanceChartsGraphic;
