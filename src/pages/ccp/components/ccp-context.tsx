import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
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
import {useTranslation} from 'react-i18next';
import {Intent} from '../models/intent.enum';

const CcpContext = () => {
    const {t} = useTranslation();
    const context = useSelector(selectContextPanel);
    const hasActiveContact = useSelector(selectHasActiveContact);
    const patientInCollectionsBalance = useSelector(selectPatientInCollectionsBalance);
    const botContext = useSelector(selectBotContext);

    const determineCallerName = () => {
        const patientFullNameAttribute = checkConnectAttributesForValue('PatientFullName');
        const initialInputNameAttribute = checkConnectAttributesForValue('InitialInputName');
        const createdForName = checkConnectAttributesForValue('CreatedForName');
        const incomingPhoneNumber = checkConnectAttributesForValue('IncomingPhoneNumber');
        const isInternalCall = checkConnectAttributesForValue('IsInternalCall');
        const internalCallFromUserName = checkConnectAttributesForValue('FromUserName');

        if (botContext?.patient) {
            return utils.stringJoin(' ', botContext.patient.firstName, botContext.patient.lastName);
        }
        if (patientFullNameAttribute) {
            return patientFullNameAttribute;
        }
        if (botContext?.contactId) {
            if (createdForName) {
                return createdForName;
            }
            const welcomeVoiceName = checkConnectAttributesForValue('WelcomeName');
            if (welcomeVoiceName) {
                return welcomeVoiceName;
            }
        }
        if (isInternalCall && Boolean(isInternalCall.toLowerCase()) === Boolean("true") && internalCallFromUserName) {
            return internalCallFromUserName;
        }
        if (createdForName) {
            return createdForName;
        }
        if (initialInputNameAttribute) {
            return initialInputNameAttribute;
        }
        if (incomingPhoneNumber) {
            return incomingPhoneNumber;
        }
        return '';
    }

    const determineCallerType = () => {
        const isInternalCall = checkConnectAttributesForValue('IsInternalCall');
        const internalCallFromUserName = checkConnectAttributesForValue('FromUserName');
        if (botContext?.patient) {
            return t('ccp.bot_context.patient');
        }
        if (botContext?.contactId) {
            return t('ccp.bot_context.contact');
        }
        if (isInternalCall && Boolean(isInternalCall.toLowerCase()) === Boolean("true") && internalCallFromUserName) {
            return t('ccp.bot_context.internal');
        }
        return '';
    }

    const checkConnectAttributesForValue = (key: string) => {
        return botContext?.attributes?.find(a => a.label === key)?.value;
    }

    const determineCallerReason = () => {
        if (!botContext?.reason || botContext.reason === 'none') {return };
        const recognizedReasonFromIntent = Intent[botContext.reason];
        return recognizedReasonFromIntent ?? utils.spaceBetweenCamelCaseWords(botContext.reason);
    }

    const botContextMessages: ContextKeyValuePair[] = useMemo(() => {
        const items: ContextKeyValuePair[] = [];

        if (botContext?.queue) {
            items.push({
                label: 'ccp.bot_context.queue',
                value: botContext?.queue
            })
        }

        const callerName = determineCallerName();
        if (callerName) {
            const callerType = determineCallerType();
            items.push({
                label: 'ccp.bot_context.caller',
                value: `${callerName}${callerType ? ` (${callerType})` : ''}`
            });
        }

        const reason = determineCallerReason();
        if (reason) {
            items.push({
                label: 'ccp.bot_context.reason',
                value: reason
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
                return <BotContext items={botContextMessages} />
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
    }, [context, hasActiveContact])

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
