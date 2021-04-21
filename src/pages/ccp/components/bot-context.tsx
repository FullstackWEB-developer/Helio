import { useSelector } from 'react-redux';
import { selectPatientInCollectionsBalance } from '../../patients/store/patients.selectors';
import { useTranslation } from 'react-i18next';
import { selectBotContext } from '../store/ccp.selectors';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';

const BotContext = () => {
    const { t } = useTranslation();
    const patientInCollectionsBalance = useSelector(selectPatientInCollectionsBalance);
    const botContext = useSelector(selectBotContext);

    return (
        <div className='py-3.5 pl-6 h7'>
            <div>{t('ccp.bot_context.header')}</div>
            <div className='grid grid-cols-8 pt-5'>
                <div className='body2-medium'>{t('ccp.bot_context.queue')}</div>
                <div className='col-span-7 subtitle2'>{botContext?.queue}</div>
            </div>
            <div className='grid grid-cols-8'>
                <div className='body2-medium'>{t('ccp.bot_context.reason')}</div>
                <div className='col-span-7 subtitle2'>{botContext?.reason}</div>
            </div>
            {
                patientInCollectionsBalance > 0 &&
                <div className={'pt-4 flex items-center'}>
                    <SvgIcon type={Icon.Warning} className='icon-medium' fillClass='warning-icon' />
                    <span className='pl-2.5 body2'>{t('ccp.bot_context.patient_in_collections')}</span>
                </div>
            }
        </div>
    )
}

export default withErrorLogging(BotContext);
