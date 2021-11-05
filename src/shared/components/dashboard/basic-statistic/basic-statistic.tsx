import {Icon} from '@components/svg-icon/icon';
import {useTranslation} from 'react-i18next';
import './basic-statistic.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';

export interface BasicStatisticProps {
    title: string;
    icon?: Icon;
    isPercentage?: boolean;
    value: string | number;
}

const BasicStatistic = ({title, value = "0", icon, isPercentage}: BasicStatisticProps) => {
    const {t} = useTranslation();
    return <div className='basic-statistic flex justify-center flex-col items-center'>
        <div className='body3-medium pt-2.5 pb-3'>{t(title)}</div>
        <div className='flex flex-row'>
            <div>
                <h4>{value}{isPercentage ? '%' : ''}</h4>
            </div>
            {icon &&
            <div className='pl-2 pt-1'><SvgIcon className='icon-small' fillClass='danger-icon' type={icon}/>
            </div>}
        </div>
    </div>
}

export default BasicStatistic;
