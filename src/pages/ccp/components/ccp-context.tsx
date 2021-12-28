import React, {useMemo} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import BotContext from './bot-context';
import NoteContext from './note-context';
import contextPanels from '../models/context-panels';
import { Suggestions } from '../models/suggestions';
import {
    selectBotContext,
    selectContextPanel,
    selectHasActiveContact,
} from '../store/ccp.selectors';
import SmsContext from '@pages/ccp/components/sms-context';
import CcpScripts from '@pages/ccp/components/ccp-scripts';
import {selectPatientInCollectionsBalance} from '@pages/patients/store/patients.selectors';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import SvgIcon, {Icon} from '@components/svg-icon';

const CcpContext = () => {
    const context = useSelector(selectContextPanel);
    const hasActiveContact = useSelector(selectHasActiveContact);
    const { t } = useTranslation();
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
            case contextPanels.scripts:
                return <CcpScripts />
            default:
                return null;
        }
    }

    const suggestions: Suggestions = {
        bot: [t('ccp.suggestions.create_patient_record'), t('ccp.suggestions.schedule_appointment')],
        note: [t('ccp.suggestions.create_patient_record'), t('ccp.suggestions.schedule_appointment')],
        tickets: ['', ''],
        sms: [t('ccp.suggestions.discuss_lab_results'), t('ccp.suggestions.send_lab_results')],
        email: ['', ''],
        scripts: ['', ''],
    }

    const renderFooter = () => {
        const suggestion = suggestions[context as keyof Suggestions]
        if (!suggestion) {
            return null;
        }
        return <>
            {
                suggestion.map((s, index) => <span key={index} className={'body2 pl-6'}>{s}</span>)
            }
        </>
    }
    return ((context && hasActiveContact) ?
        <div className={'ccp-context flex flex-col'}>
            <div className={'ccp-header'} />
            <div className={'ccp-main-content flex-grow bg-white border-l overflow-y-auto'}>
                {renderContext()}
            </div>
            <div className={'ccp-footer h-10 flex shadow-md border-t border-l box-content p-0 items-center'}>
                <div className={'pl-6 subtitle2'}>{t('ccp.suggested_steps')}</div>
                <div>
                    {renderFooter()}
                </div>
            </div>
        </div> : null
    )
}

export default withErrorLogging(CcpContext);
