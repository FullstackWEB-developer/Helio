import './horizantal-statistic-widget.scss';
import {useTranslation} from 'react-i18next';
import Dropdown, { DropdownModel } from '@components/dropdown';
import { customHooks } from '@shared/hooks';
import { useRef, useState } from 'react';
import SvgIcon, { Icon } from '@components/svg-icon';

var dayjs = require("dayjs")
var duration = require('dayjs/plugin/duration')
var utc = require('dayjs/plugin/utc')

interface BasicStatistic {
    label: string | number | Date;
    percentage: number;
    value?: number;
}

interface DropdownItemModel {
    label: string;
    value: string;
}

export interface HorizantalStatisticWidgetProps {
    data: BasicStatistic[];
    title: string;
    description: string;
    wrapperClass?: string;
    dropdownSelected?: (id: string) => void;
    dropdownItems?: DropdownItemModel[]
}

const HorizantalStatisticWidget = ({data, title, description, wrapperClass = 'w-full h-96', dropdownSelected, dropdownItems}: HorizantalStatisticWidgetProps) => {
    const {t} = useTranslation();
    dayjs.extend(duration)
    dayjs.extend(utc)
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const [displayTypeDropdown, setDisplayTypeDropdown] = useState<boolean>(false);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<string | undefined>(dropdownItems && dropdownItems[0].label);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState<string | undefined>(dropdownItems && dropdownItems[0].value);
    const dropdownModel: DropdownModel = {
        defaultValue: selectedDropdownValue,
        onClick: (id) => dropdownSelected && onDropdownSelected(id),
        items: dropdownItems
    };
    const onDropdownSelected = (id: string) => {
        if(dropdownSelected){
            dropdownSelected(id);
            setSelectedDropdownItem(dropdownItems?.find(x => x.value === id)?.label);
            setSelectedDropdownValue(id);
            setDisplayTypeDropdown(false);
        }
    }

    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayTypeDropdown(false);
    });

    const Item = (item: BasicStatistic) => {
        const width = `${item.percentage}%`;
        return <div className='flex flex-col h-14'>
            <div className='flex flex-row justify-between'>
                <div>{item.label}</div>
                <div className='flex flex-row'>
                    <div className='w-10 flex justify-end'>{item.value !== undefined ? `${dayjs.utc(dayjs.duration(item.value).asMilliseconds()).format('HH:mm:ss')}` : `${item.percentage}%`}</div>
                </div>
            </div>
            <div>
                <div className='h-2 horizantal-statistic-widget-row rounded' style={{width: width}}/>
                <div className='h-2 horizantal-statistic-widget-row-bg relative bottom-2 rounded'/>
            </div>
        </div>
    }
    if (!data || data.length === 0) {
        return <div className={`${wrapperClass} px-6 pt-4 bg-white rounded-lg`}>
            <div className='h7'>{dropdownSelected ? `${selectedDropdownItem && t(selectedDropdownItem)} ${t(title)}` : `${t(title)}`}</div>
            <div className='mb-7 h7'>{t(description)}</div>
            <div className='w-full h-72 px-6 space-y-4 horizantal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
        </div>
    }

    return <div className={`${wrapperClass} px-6 pt-4 bg-white rounded-lg`}>
        <div className='flex justify-between'>
            <div className='h7'>{dropdownSelected ? `${selectedDropdownItem && t(selectedDropdownItem)} ${t(title)}` : `${t(title)}`}</div>
            {
                dropdownSelected && <div className='relative z-10' ref={typeDropdownRef}>
                    <div onClick={() => setDisplayTypeDropdown(!displayTypeDropdown)}
                        className='flex flex-row items-center cursor-pointer'>
                        <div>{selectedDropdownItem && t(selectedDropdownItem)}</div>
                        <div className='pl-2'>
                            <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                className='icon-medium' fillClass='dashboard-dropdown-arrows' />
                        </div>
                    </div>
                    {displayTypeDropdown &&
                        <div className='absolute'>
                            <Dropdown model={dropdownModel} />
                        </div>}
                </div>
            }
        </div>
        <div className='mb-7 h7'>{t(description)}</div>
        {
            data.map(item => <Item key={item.label.toString()} label={item.label} percentage={item.percentage} value={item.value}/>)
        }
    </div>
}

export default HorizantalStatisticWidget;
