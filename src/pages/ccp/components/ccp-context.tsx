import React, {useMemo} from 'react';
import { useSelector } from 'react-redux';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import BotContext from './bot-context';
import NoteContext from './note-context';
import contextPanels from '../models/context-panels';

import {
    selectBotContext,
    selectContextPanel,
    selectHasActiveContact,
} from '../store/ccp.selectors';
import SmsContext from '@pages/ccp/components/sms-context';
import {selectPatientInCollectionsBalance} from '@pages/patients/store/patients.selectors';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import SvgIcon, {Icon} from '@components/svg-icon';
import utils from '@shared/utils/utils';
import ExtensionsContext from '@pages/ccp/components/extensions-context';

const CcpContext = () => {
    const context = useSelector(selectContextPanel);
    const hasActiveContact = useSelector(selectHasActiveContact);
    const patientInCollectionsBalance = useSelector(selectPatientInCollectionsBalance);
    const botContext = useSelector(selectBotContext);

    const botContextMessages: ContextKeyValuePair[] = useMemo(() => {
        const items =  [
            {
                label : 'ccp.bot_context.queue',
                value: botContext?.queue
            },
            {
                label: 'ccp.bot_context.reason',
                value: botContext?.reason
            }
        ] as ContextKeyValuePair[];

        if (botContext?.patient) {
            items.push({
                label: 'ccp.bot_context.patient_name',
                value: utils.stringJoin(' ', botContext.patient.firstName, botContext.patient.lastName)
            });
        }

        if (botContext?.isPregnant) {
            items.push({
                label: 'ccp.bot_context.pregnancy',
                value: 'ccp.bot_context.patient_is_pregnant'
            });
        }
        if (patientInCollectionsBalance) {
            items.push({
                value: 'ccp.bot_context.patient_in_collections',
                containerClass: 'pt-4 flex items-center',
                label: <SvgIcon type={Icon.Warning} className='icon-medium' fillClass='warning-icon' />
            });
        }
        return items;
    }, [patientInCollectionsBalance, botContext]);

    const renderContext = () => {
        switch (context) {
            case contextPanels.bot:
                return <BotContext items={botContextMessages}/>
            case contextPanels.note:
                return <NoteContext />
            case contextPanels.sms:
                return <SmsContext />
            case contextPanels.extensions:
                return <ExtensionsContext />
            default:
                return null;
        }
    }

    const displayContext = useMemo(() => {
        if (!context) {
            return false;
        }
        return hasActiveContact || context === contextPanels.extensions
    }, [context, hasActiveContact ])

    if (!displayContext) {
        return null;
    }
    return <div className={'ccp-context flex flex-col'}>
            <div className={'ccp-header'} />
            <div className={'ccp-main-content flex-grow bg-white border-l'}>
                {renderContext()}
            </div>
        </div>
}

export default withErrorLogging(CcpContext);
