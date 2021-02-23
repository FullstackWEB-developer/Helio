import React from "react";
import BotContext from "./bot-context";
import {useSelector} from "react-redux";
import {selectContextPanel} from "../store/ccp.selectors";
import contextPanels from "../models/constants";
import {useTranslation} from "react-i18next";
import {Suggestions} from "../models/suggestions";
import withErrorLogging from "../../../shared/HOC/with-error-logging";

const CcpContext = () => {
    const context = useSelector(selectContextPanel);
    const {t} = useTranslation();
    const renderContext = () => {
        switch (context) {
            case contextPanels.bot:
                return <BotContext/>
            case contextPanels.note:
                return <BotContext/>
            case contextPanels.tickets:
                return <BotContext/>
            case contextPanels.sms:
                return <BotContext/>
            case contextPanels.email:
                return <BotContext/>
            case contextPanels.scripts:
                return <BotContext/>
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
        let suggestion = suggestions[context as keyof Suggestions]
        return <>
            {
                suggestion.map((s, index) => <span key={index} className={"pl-8"}>{s}</span>)
            }
        </>
    }
    return(context ?
        <div className={"ccp-context flex flex-col h-120"}>
            <div className={"ccp-header h-11"}/>
            <div className={"flex-grow bg-white"}>
                {renderContext()}
            </div>
            <div className={"ccp-footer border-t bg-white flex"}>
                <div className={"px-8 pt-2 font-bold"}>{t('ccp.suggested_steps')}</div>
                <div className={"pt-3 text-sm"}>
                    {renderFooter()}
                </div>
            </div>
        </div> : null
    )
}

export default withErrorLogging(CcpContext);