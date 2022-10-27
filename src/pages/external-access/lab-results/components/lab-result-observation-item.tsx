import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {LabResultObservation} from '../models/lab-result-observation.model';

const LabResultObservationItem = ({observation, isMobile = false, index = 0, totalCount = 1}: {observation: LabResultObservation, isMobile?: boolean, index?: number, totalCount?: number}) => {
    const {t} = useTranslation();

    const determineAbnormalFlagIcon = () => {
        switch (observation.abnormalFlag) {
            case "high":
                return <SvgIcon type={Icon.ArrowTrendUp} className='pl-1' fillClass='analyte-trend-fill' />;
            case "low":
                return <SvgIcon type={Icon.ArrowTrendDown} className='pl-1' fillClass='analyte-trend-fill' />;
            default:
                return null;
        }
    }
    const determineAbnormalValueColor = () => {
        switch (observation.abnormalFlag) {
            case "high":
            case "low":
                return 'analyte-trend-color';
            default:
                return '';
        }
    }

    const renderNotAvailableLabel = () => {
        return observation.note ? '' : t('common.not_available');
    }

    if(isMobile){
        return(
            <>
                <div className={`grid gap-x-8 body2 grid-cols-1 lab-results-border px-4 pb-4 ${totalCount > 1 ? 'mt-4' : ''}`}>
                    <div className={`flex justify-end h-4 p-2 lab-results-grayed-label`}>
                        {`#${index}`}
                    </div>
                    <div>
                        <span className='lab-results-grayed-label pr-1'>
                            {t('external_access.lab_results.analytes')}:
                        </span>
                        {observation.analyteName || t('common.not_available')}
                    </div>
                    <div>
                        <span className='lab-results-grayed-label pr-1'>
                            {t('external_access.lab_results.value')}:
                        </span>
                        <span title={observation.value || renderNotAvailableLabel()} className={`truncate ${determineAbnormalValueColor()}`}>{observation.value || renderNotAvailableLabel()}</span>
                            {determineAbnormalFlagIcon()}
                    </div>
                    <div>
                        <span className='lab-results-grayed-label pr-1'>
                            {t('external_access.lab_results.ref_range')}:
                        </span>
                        {observation.referenceRange || renderNotAvailableLabel()}
                    </div>
                    <div>
                        <span className='lab-results-grayed-label pr-1'>
                            {t('external_access.lab_results.units')}:
                        </span>
                        {observation.units || renderNotAvailableLabel()}
                    </div>
                    <div />
                    {
                        observation.note &&
                        <>
                            <div>
                                <span className='lab-results-grayed-label pr-1'>
                                    {t('external_access.lab_results.units')}:
                                </span>
                                {observation.units || renderNotAvailableLabel()}
                            </div>
                            <div />
                        </>
                    }
                </div>
            </>
        );
    } 

    return (
        <div className={`px-4 observations-grid data-row body2 ${observation.note ? 'note-mode' : ''}`}>
            <div>
                {observation.analyteName || t('common.not_available')}
            </div>
            <div className='flex items-center justify-start'>
                <span title={observation.value || renderNotAvailableLabel()} className={`truncate ${determineAbnormalValueColor()}`}>{observation.value || renderNotAvailableLabel()}</span>
                {determineAbnormalFlagIcon()}
            </div>
            <div>
                {observation.referenceRange || renderNotAvailableLabel()}
            </div>
            <div>
                {observation.units || renderNotAvailableLabel()}
            </div>
            {
                observation.note &&
                <>
                    <div></div>
                    <div className="col-span-3">                        
                        <pre className='whitespace-pre-wrap py-3 body3 truncate'>{observation.note}</pre>
                    </div>
                </>
            }
        </div>
    )
}

export default LabResultObservationItem;