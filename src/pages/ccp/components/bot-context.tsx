import { useSelector } from 'react-redux';
import { selectPatientInCollectionsBalance } from '../../patients/store/patients.selectors';
import { useTranslation } from 'react-i18next';
import { selectBotContext } from '../store/ccp.selectors';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';

const BotContext = () => {
    const { t } = useTranslation();
    const patientInCollectionsBalance = useSelector(selectPatientInCollectionsBalance);
    const botContext = useSelector(selectBotContext);

    return (
        <div className='pt-6 pl-8 text-sm'>
            <div className='text-lg font-bold pb-6'>{t('ccp.bot_context.header')}</div>
            <div className='grid grid-cols-8'>
                <div className='text-gray-400'>{t('ccp.bot_context.queue')}</div>
                <div className='col-span-7 font-bold'>{botContext?.queue}</div>
            </div>
            <div className='grid grid-cols-8'>
                <div className='text-gray-400'>{t('ccp.bot_context.reason')}</div>
                <div className='col-span-7 font-bold'>{botContext?.reason}</div>
            </div>
            {
                patientInCollectionsBalance > 0 && <div className={'pt-4 flex content-center'}>
                    <SvgIcon type={Icon.Warning} className='medium' fillClass='warning-icon'/>
                    <span className='pt-1 pl-3'>{t('ccp.bot_context.patient_in_collections')}</span>
                </div>
            }
        </div>
    )
}

export default withErrorLogging(BotContext);
