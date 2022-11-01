import {useTranslation} from 'react-i18next';
import React from 'react';
import TooltipWrapper from '@components/tooltip/tooltip-wrapper';

const WallboardBasicStatistic = ({title, data, dataClassName, tooltip} : {title :string, data: string | number, dataClassName?: string, tooltip?: string}) => {
    const {t} = useTranslation();
    const isNumber = typeof data ==='number';
    return <div className='basic-statistic flex justify-center flex-col items-center w-full performance-today-basic-statistic-cell '>
        <TooltipWrapper placement='top' content={tooltip}>
            <div className='body3-medium pt-2.5 pb-3'>{t(title)}</div>
        </TooltipWrapper>
        <div className='flex flex-row'>
            <div>
                {isNumber ? <h4 className={dataClassName}>{data}</h4> : <h5 className={dataClassName}>{data}</h5>}
            </div>
        </div>
    </div>
}

export default WallboardBasicStatistic;
