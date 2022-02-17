import React, {useMemo, useRef, useState} from 'react';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {ContactExtended} from '@shared/models';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useSelector} from 'react-redux';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import './conversation-header-quick-actions-stripe.scss';
import {customHooks} from '@shared/hooks';
import {useTranslation} from 'react-i18next';
import {PhoneType} from '@shared/models/phone-types.enum';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import utils from '@shared/utils/utils';
import {Link} from 'react-router-dom';
import {EmailPath, SmsPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';
import classNames from 'classnames';

const ConversationHeaderQuickActionsStripe = ({patient, contact}: {patient?: ExtendedPatient, contact?: ContactExtended}) => {

    const patientHasAnyPhoneOptions = patient?.mobilePhone || patient?.homePhone;
    const contactHasAnyPhoneOptions = contact?.mobilePhone || contact?.workDirectPhone || contact?.workMainPhone;
    const voiceCounter = useSelector(selectVoiceCounter);
    const [phoneTypeOptions, setPhoneTypeOptions] = useState<DropdownItemModel[]>([]);
    const [selectedPhoneType, setSelectedPhoneType] = useState<PhoneType>(phoneTypeOptions?.length > 0 ? Number(phoneTypeOptions[0].value) : patient ? PhoneType.patientMobile : PhoneType.contactMobile);
    const {t} = useTranslation();
    const phoneTypeSelected = (type: PhoneType) => {
        setDisplayPhoneTypeDropdown(false);
        setSelectedPhoneType(type);
    }
    useMemo(() => {
        const generatePhoneTypeDropdownOptions = (): DropdownItemModel[] => {
            let options: DropdownItemModel[] = [];
            if (patient) {
                const {mobilePhone, homePhone} = patient;
                if (mobilePhone) {
                    options.push({label: t('email.inbox.phone_types.1'), value: String(PhoneType.patientMobile)});
                }
                if (homePhone) {
                    options.push({label: t('email.inbox.phone_types.2'), value: String(PhoneType.patientHome)});
                }
            }
            else if (contact) {
                const {mobilePhone, workDirectPhone, workMainPhone} = contact;
                if (mobilePhone) {
                    options.push({label: t('email.inbox.phone_types.3'), value: String(PhoneType.contactMobile)});
                }
                if (workMainPhone) {
                    options.push({label: t('email.inbox.phone_types.4'), value: String(PhoneType.contactWorkMain)});
                }
                if (workDirectPhone) {
                    options.push({label: t('email.inbox.phone_types.5'), value: String(PhoneType.contactWorkDirect)});
                }
            }
            return options;
        }

        const options = generatePhoneTypeDropdownOptions();
        setPhoneTypeOptions(options);
        if (!options.find(a => a.value === selectedPhoneType.toString()) && options[0]) {
            setSelectedPhoneType(Number(options[0].value))
        }
    }, [contact, patient, t]);

    const phoneTypeDropdownModel: DropdownModel = {
        defaultValue: selectedPhoneType?.toString(),
        onClick: (id) => phoneTypeSelected(Number(id)),
        items: phoneTypeOptions
    };

    const handleOnPhoneClick = () => {
        switch (selectedPhoneType) {
            case PhoneType.patientMobile:
                if (patient?.mobilePhone) {
                    utils.initiateACall(patient.mobilePhone);
                }
                break;
            case PhoneType.patientHome:
                if (patient?.homePhone) {
                    utils.initiateACall(patient.homePhone);
                }
                break;
            case PhoneType.contactMobile:
                if (contact?.mobilePhone) {
                    utils.initiateACall(contact.mobilePhone);
                }
                break;
            case PhoneType.contactWorkMain:
                if (contact?.workMainPhone) {
                    utils.initiateACall(contact.workMainPhone);
                }
                break;
            case PhoneType.contactWorkDirect:
                if (contact?.workDirectPhone) {
                    utils.initiateACall(contact.workDirectPhone);
                }
                break;
            default:
                break;
        }
    }

    const [displayPhoneTypeDropdown, setDisplayPhoneTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayPhoneTypeDropdown(false);
    });

    return (
        <div className='flex'>
            <span className={classNames('pr-3', {'cursor-pointer': patientHasAnyPhoneOptions || contactHasAnyPhoneOptions})} >
                <SvgIcon type={Icon.ChannelPhone}
                    className='icon-x-large'
                    fillClass={'collapsible-arrow-icon'}
                    strokeClass='conversation-header-quick-actions-stroke'
                    onClick={handleOnPhoneClick}
                    disabled={voiceCounter === 1 || (!contactHasAnyPhoneOptions && !patientHasAnyPhoneOptions)}
                />
            </span>
            <div className='flex items-center cursor-pointer relative' ref={typeDropdownRef}>
                <div
                    onClick={() => {if (contactHasAnyPhoneOptions || patientHasAnyPhoneOptions) {setDisplayPhoneTypeDropdown(!displayPhoneTypeDropdown)} }}
                    className='flex flex-row'>
                    <div className={`${contactHasAnyPhoneOptions || patientHasAnyPhoneOptions ? 'conversation-header-quick-actions-phone-type' : 'conversation-header-quick-actions-phone-type-disabled'}`}>
                        {t(`email.inbox.phone_types.${selectedPhoneType}`)}
                    </div>
                    <div className='pl-1.5'>
                        <SvgIcon type={displayPhoneTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                            disabled={voiceCounter === 1}
                            className={'icon-medium'}
                            fillClass={`${contactHasAnyPhoneOptions || patientHasAnyPhoneOptions ? 'conversation-header-quick-actions-dropdown-arrows' : 'rgba-025-fill'}`} />
                    </div>
                </div>
                {displayPhoneTypeDropdown &&
                    <div className='absolute pt-32 z-30'>
                        <Dropdown model={phoneTypeDropdownModel} />
                    </div>}
            </div>
            <span className='pl-8 pr-6'>
                <Link
                    className={contact?.mobilePhone || patient?.mobilePhone ? '' : 'disabled-link'}
                    to={{
                        pathname: contact?.mobilePhone || patient?.mobilePhone ? `${SmsPath}` : '#',
                        state: {
                            ...(patient && {patient}),
                            ...(contact && {contact})
                        }
                    }}>
                    <SvgIcon type={Icon.ChannelSms}
                        disabled={!contact?.mobilePhone && !patient?.mobilePhone}
                        fillClass={contact?.mobilePhone || patient?.mobilePhone ? 'collapsible-arrow-icon' : ''}
                        className='icon-x-large'
                        strokeClass='conversation-header-quick-actions-stroke'
                    />
                </Link>
            </span>
            <span className="pr-8">
                <Link
                    className={contact?.emailAddress || patient?.emailAddress ? '' : 'disabled-link'}
                    to={{
                        pathname: contact?.emailAddress || patient?.emailAddress ? `${EmailPath}/${NEW_EMAIL}` : '#',
                        state: {
                            ...(patient && {patient}),
                            ...(contact && {contact})
                        }
                    }}>
                    <SvgIcon type={Icon.ChannelEmail}
                        disabled={!contact?.emailAddress && !patient?.emailAddress}
                        className='icon-x-large'
                        fillClass={contact?.emailAddress || patient?.emailAddress ? 'collapsible-arrow-icon' : ''}
                        strokeClass='conversation-header-quick-actions-stroke'
                    />
                </Link>
            </span>
        </div>
    )
}

export default ConversationHeaderQuickActionsStripe;
