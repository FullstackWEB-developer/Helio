import {Icon} from '@components/svg-icon/icon';
import {Trans, useTranslation} from 'react-i18next';
import './basic-statistic.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';

export interface BasicStatisticProps {
    title: string;
    icon?: Icon;
    isPercentage?: boolean;
    value: string | number;
    valueClass?: string;
    wrapperClass?: string;
    tooltip?: string;
}

const BasicStatistic = ({title, value = "0", icon, isPercentage, valueClass, wrapperClass, tooltip}: BasicStatisticProps) => {
    const {t} = useTranslation();
    return <div className={`basic-statistic flex justify-center flex-col items-center ${wrapperClass}`}>
        <div className='flex flex-row px-1'>
        <div className='body3-medium pt-2.5 pb-3'>{t(title)}</div>
        {tooltip && <ToolTipIcon
            icon={Icon.Info}
            iconFillClass='warning-icon'
            placement='right-start'
            className='pt-1'
            iconClassName='icon-medium'
        >
            <div className='flex flex-col p-3'>
                <Trans i18nKey={tooltip}>
                    <span className=' whitespace-pre-wrap body2'>{tooltip}</span>
                </Trans>
            </div>
        </ToolTipIcon>}
        </div>
        <div className='flex flex-row'>
            <div>
                {valueClass ? <div className={valueClass}>{value}{isPercentage ? '%' : ''}</div> :
                    <h4>{value}{isPercentage ? '%' : ''}</h4>}
            </div>
            {icon &&
            <div className='pl-2 pt-1'><SvgIcon className='icon-small' fillClass='danger-icon' type={icon}/>
            </div>}

        </div>
    </div>
}

export default BasicStatistic;
