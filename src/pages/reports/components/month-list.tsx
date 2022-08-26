import Button from '@components/button/button';
import Checkbox from '@components/checkbox/checkbox';
import {Icon} from '@components/svg-icon';
import {Dictionary} from '@shared/models';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import './month-list.scss';

export interface MonthListProps {
    data: Dictionary<string>,
    selectedMonths: string[],
    setSelectedMonths: (selectedMonths: string[]) => void,
    exportReportDownload: () => void,
    isDownloading: boolean
}

const MonthList = ({data, selectedMonths,
    setSelectedMonths, exportReportDownload, isDownloading}: MonthListProps) => {
    const {t} = useTranslation();
    const onCheckboxChanged = (item: any) => {
        if (item.checked) {
            setSelectedMonths([...selectedMonths, item.value]);
        } else {
            setSelectedMonths(selectedMonths.filter(data => data != item.value));
        }
    }
    const renderAvailableMonthsCheckbox = useCallback(() => {
        return (
            Object.entries(data).map(([key, value]) => {
                return <div key={key} className='flex flex-row h-10 items-center border-b'>
                    <Checkbox
                        label={value}
                        name={key}
                        value={key}
                        checked={selectedMonths.includes(key)}
                        className='body2 h-auto px-6'
                        labelClassName=''
                        hasTooltip={false}
                        onChange={(e) => onCheckboxChanged(e)} />
                </div>
            })
        );
    }, [data, selectedMonths]);

    return (
        <div className='bg-white rounded-lg'>
            <div className='px-6 flex justify-between h-14 items-center'>
                <h6 className='pt-5'>{t('reports.view_options.monthly_reports')}</h6>
                <div>
                    <Button label='reports.download' buttonType='secondary-medium' icon={Icon.Download} iconSize='icon-small'
                        disabled={selectedMonths.length === 0} isLoading={isDownloading} onClick={() => exportReportDownload()} />
                </div>
            </div>
            <div className="h-12 px-14 subtitle2 month-list uppercase flex items-center caption-caps">
                <div className="truncate">{t('reports.month')}</div>
            </div>
            <div className='pb-8'>
                <form className='flex flex-1 flex-col group'>
                    {
                        renderAvailableMonthsCheckbox()
                    }
                </form>
            </div>
        </div>
    );
}

export default MonthList;
