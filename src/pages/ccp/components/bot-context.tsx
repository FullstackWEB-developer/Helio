import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React from 'react';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import classnames from 'classnames';
import PersonalCallChanger from './personal-call-changer';
import {useSelector} from 'react-redux';
import {selectBotContext} from '@pages/ccp/store/ccp.selectors';

export interface BotContextProps {
    items: ContextKeyValuePair[];
}

const BotContext = ({items} : BotContextProps) => {
    const { t } = useTranslation();
    const botContext = useSelector(selectBotContext);
    
    return (
        <div className='py-3.5 pl-6 h7'>
            <div className='pb-5'>{t('ccp.bot_context.header')}</div>
            {items.map((item, index) => {
                const isStringLabel = typeof item.label === 'string';
                const containerClass = classnames(item.containerClass, {
                    'grid grid-cols-6' : !item.containerClass
                })
                return <div className={containerClass} key={item.value}>
                    {isStringLabel && <div className='body2-medium col-span-1'>{t(item.label as string)}</div>}
                    {!isStringLabel && item.label}
                    <div className={`${botContext.isInBound ? 'col-span-4' : 'col-span-2'} subtitle2`}>{t(item.value)}</div>
                    {index === 0 && (<PersonalCallChanger/>)}
                </div>
            })}
        </div>
    )
}

export default withErrorLogging(BotContext);
