import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import './alert.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
export interface AlertProps {
    message: string;
    type: 'error' | 'info'
}
const Alert = ({message, type}: AlertProps) => {
    const {t} = useTranslation();

    const icon = useMemo(() => {
        if (type === 'error') {
            return <SvgIcon type={Icon.Error} fillClass='fill-red' />
        } else if (type === 'info') {
            return <SvgIcon type={Icon.Error} fillClass='fill-yellow' />
        }
    },[type])

    return <div className={`alert alert-${type} py-3 z-50 px-4 flex flex-row space-x-4 items-center`}>
        <div>
            {icon}
        </div>
        <div>
            {t(message)}
        </div>
    </div>
}

export default Alert;
