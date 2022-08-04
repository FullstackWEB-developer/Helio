import Button from '@components/button/button';
import { ControlledSelect } from '@components/controllers';
import { Icon } from '@components/svg-icon';
import Tabs, { Tab } from '@components/tab';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import './reports.scss';
import { reportTypes, viewTypes } from './utils/constants';
import { TabTypes } from './models/tab-types.enum';
import { ViewTypes } from './models/view-types.enum';

const Reports = () => {
    const {t} = useTranslation();
    const [selectedSelectedView, setSelectedView] = useState<ViewTypes>();
    const [selectedTab, setSelectedTab] = useState<TabTypes>(TabTypes.Reports);

    const {control, handleSubmit} = useForm({
        mode: 'all'
    });
    

    const onSubmit = (form: any) => {
        
    }

    const onTabChange = (tab: number) => {
        setSelectedTab(tab);
        setSelectedView(undefined);
    }
    
    const settings = () => {
        return <div className='my-6'>
            {selectedSelectedView === ViewTypes.MonthlyReports && <h6 className='pt-3 mb-1'>{t('reports.view_options.monthly_reports')}</h6>}
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col group'>
                <div className='flex flex-row mt-5 gap-8'>
                    {
                        selectedTab === TabTypes.Reports && <div className='reports-select h-14'>
                            <ControlledSelect
                                name='report-type'
                                control={control}
                                label='reports.report'
                                options={reportTypes}
                            />
                        </div>
                    }
                    <div className='w-48 h-14'>
                        <ControlledSelect
                            name='view-type'
                            control={control}
                            label='reports.view'
                            options={viewTypes}
                            onSelect={(option) => setSelectedView(option?.value as ViewTypes)}
                        />
                    </div>
                    {
                        selectedTab === TabTypes.Reports && <div className='w-2/4 h-14 flex items-center'>
                            <Button label='reports.view' type='submit' buttonType='medium' />
                            {
                                selectedSelectedView !== ViewTypes.MonthlyReports && <Button label='reports.download' className='mx-6' buttonType='secondary-medium' icon={Icon.Download} />
                            }
                        </div>
                    }
                </div>
            </form>
        </div>
    };
    
    return (
        <div className='reports w-full h-full overflow-y-auto p-6'>
            <h5>{t('reports.reports')}</h5>
            <div className='mt-6'>
                <Tabs onSelect={(tab) => onTabChange(tab)}>
                    <Tab key={TabTypes.Reports} title={t('reports.reports')}>
                        {settings()}
                    </Tab>
                    <Tab key={TabTypes.PerformanceCharts} title={t('reports.performance_charts')}>
                        {settings()}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
export default Reports;
