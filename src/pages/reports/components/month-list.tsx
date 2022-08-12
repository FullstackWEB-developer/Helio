import Button from '@components/button/button';
import { ControlledCheckbox } from '@components/controllers';
import { Icon } from '@components/svg-icon';
import { Dictionary } from '@shared/models';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import './month-list.scss';

export interface MonthListProps {
    data: Dictionary<string>,
    downloadReports: (selectedMonths: string[]) => void,
}

const MonthList = ({data, downloadReports}: MonthListProps) => {
    const {t} = useTranslation();
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const {control} = useForm({
        mode: 'all'
    });
    const onCheckboxChanged = (item: any) => {
        if(item.checked){
            setSelectedMonths([...selectedMonths, item.value]);
        }else{
            setSelectedMonths(selectedMonths.filter(data => data != item.value));
        }
    }
    return (
        <div className='bg-white rounded-lg'>
            <div className='px-6 flex justify-between h-14 items-center'>
                <h6 className='pt-5'>{t('reports.view_options.monthly_reports')}</h6>
                <div>
                    <Button label='reports.download' buttonType='secondary-medium' icon={Icon.Download} iconSize='icon-small' disabled={selectedMonths.length === 0} onClick={() => downloadReports(selectedMonths)}/>
                </div>
            </div>
            <div className="h-12 px-14 subtitle2 month-list uppercase flex items-center caption-caps">
                <div className="truncate">{t('reports.month')}</div>
            </div>
            <div className='pb-8'>
                <form className='flex flex-1 flex-col group'>
                    {
                        Object.entries(data).map(([key, value]) =>
                            <div className='flex flex-row h-10 items-center border-b'>
                                <ControlledCheckbox
                                    control={control}
                                    label={value}
                                    name={key}
                                    value={key}
                                    className='body2 h-auto px-6'
                                    labelClassName=''
                                    hasTooltip={false}
                                    onChange={(e) => onCheckboxChanged(e)}/>
                            </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default MonthList;
