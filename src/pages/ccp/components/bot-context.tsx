import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React from 'react';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import classnames from 'classnames';

export interface BotContextProps {
    items: ContextKeyValuePair[];
}

const BotContext = ({items} : BotContextProps) => {
    const { t } = useTranslation();

    return (
        <div className='py-3.5 pl-6 h7'>
            <div className='pb-5'>{t('ccp.bot_context.header')}</div>
            {items.map((item) => {
                const isStringLabel = typeof item.label === 'string';
                const containerClass = classnames(item.containerClass, {
                    'grid grid-cols-12' : !item.containerClass
                })
                return <div className={containerClass}>
                    {isStringLabel && <div className='body2-medium col-span-2'>{t(item.label as string)}</div>}
                    {!isStringLabel && item.label}
                    <div className='col-span-6 subtitle2'>{t(item.value)}</div>
                </div>
            })}
        </div>
    )
}

export default withErrorLogging(BotContext);
