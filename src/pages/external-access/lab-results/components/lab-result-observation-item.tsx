import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {LabResultObservation} from '../models/lab-result-observation.model';

const LabResultObservationItem = ({observation}: {observation: LabResultObservation}) => {
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
    return (
        <div className={`px-4 observations-grid data-row body2 ${observation.note ? 'note-mode' : ''}`}>
            <div>
                {observation.analyteName || t('common.not_available')}
            </div>
            <div className='flex items-center justify-start'>
                <span className={determineAbnormalValueColor()}>{observation.value || renderNotAvailableLabel()}</span>
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
                        <pre className='whitespace-pre-wrap py-3 body3'>{observation.note}</pre>
                    </div>
                </>
            }
        </div>
    )
}

export default LabResultObservationItem;