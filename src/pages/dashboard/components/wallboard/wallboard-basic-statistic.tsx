import {useTranslation} from 'react-i18next';
import React from 'react';

const WallboardBasicStatistic = ({title, data, dataClassName} : {title :string, data: string | number, dataClassName?: string}) => {
    const {t} = useTranslation();
    const isNumber = typeof data ==='number';
    return <div className='basic-statistic flex justify-center flex-col items-center w-full performance-today-basic-statistic-cell '>
        <div className='body3-medium pt-2.5 pb-3'>{t(title)}</div>
        <div className='flex flex-row'>
            <div>
                {isNumber ? <h4 className={dataClassName}>{data}</h4> : <h5 className={dataClassName}>{data}</h5>}
            </div>
        </div>
    </div>
}

export default WallboardBasicStatistic;
