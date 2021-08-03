import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import BotContext from './bot-context';
import NoteContext from './note-context';
import contextPanels from '../models/context-panels';
import { Suggestions } from '../models/suggestions';
import { selectContextPanel } from '../store/ccp.selectors';
import SmsContext from '@pages/ccp/components/sms-context';


const CcpContext = () => {
    const context = useSelector(selectContextPanel);
    const { t } = useTranslation();
    const renderContext = () => {
        switch (context) {
            case contextPanels.bot:
                return <BotContext />
            case contextPanels.note:
                return <NoteContext />
            case contextPanels.tickets:
                return <BotContext />
            case contextPanels.sms:
                return <SmsContext />
            case contextPanels.email:
                return <BotContext />
            case contextPanels.scripts:
                return <BotContext />
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
        return <>
            {
                suggestion.map((s, index) => <span key={index} className={'body2 pl-6'}>{s}</span>)
            }
        </>
    }
    return (context ?
        <div className={'ccp-context flex flex-col'}>
            <div className={'ccp-header'} />
            <div className={'ccp-main-content flex-grow bg-white border-l'}>
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
