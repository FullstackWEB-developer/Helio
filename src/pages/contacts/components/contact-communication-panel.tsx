import {ContactExtended} from '@shared/models';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import {ContactPhoneType} from '@pages/contacts/enums/contact-phone-type.enum';
import customHooks from '../../../shared/hooks/customHooks';
import utils from '@shared/utils/utils';
import SvgIcon, {Icon} from '@components/svg-icon';
import {Link} from 'react-router-dom';
import {EmailPath, SmsPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';
import './contact-communication-panel.scss';

export interface ContactCommunicationPanelProps {
    contact: ContactExtended,
    editMode?: boolean;
    isVisible: boolean;
}
const ContactCommunicationPanel = ({contact, editMode, isVisible}: ContactCommunicationPanelProps) =>  {
    const {t} = useTranslation();
    const voiceCounter = useSelector(selectVoiceCounter);

    const [displayPhoneTypeDropdown, setDisplayPhoneTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const [phoneTypeOptions, setPhoneTypeOptions] = useState<DropdownItemModel[]>([]);
    const [selectedPhoneType, setSelectedPhoneType] = useState<ContactPhoneType>(phoneTypeOptions?.length > 0 ? Number(phoneTypeOptions[0].value) : ContactPhoneType.mobile);
    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayPhoneTypeDropdown(false);
    });

    useEffect(() => {
        if (!isVisible) {
            setDisplayPhoneTypeDropdown(false);
        }
    }, [isVisible])

    const phoneTypeSelected = (type: ContactPhoneType) => {
        setDisplayPhoneTypeDropdown(false);
        setSelectedPhoneType(type);
    }

    const contactHasAnyPhoneOption = contact?.mobilePhone || contact?.workDirectPhone || contact?.workMainPhone;
    useMemo(() => {
        const generatePhoneTypeDropdownOptions = (): DropdownItemModel[] => {
            let options: DropdownItemModel[] = [];
            const {mobilePhone, workDirectPhone, workMainPhone} = contact;
            if (mobilePhone) {
                options.push({label: t('contacts.contact_details.individual.phone_types.1'), value: String(ContactPhoneType.mobile)});
            }
            if (workMainPhone) {
                options.push({label: t('contacts.contact_details.individual.phone_types.2'), value: String(ContactPhoneType.workMain)});
            }
            if (workDirectPhone) {
                options.push({label: t('contacts.contact_details.individual.phone_types.3'), value: String(ContactPhoneType.workDirect)});
            }
            return options;
        }

        const options = generatePhoneTypeDropdownOptions();
        setPhoneTypeOptions(options);
        if (!options.find(a => a.value=== selectedPhoneType.toString()) && options[0]) {
            setSelectedPhoneType(Number(options[0].value))
        }
    }, [contact, t]);

    const phoneTypeDropdownModel: DropdownModel = {
        defaultValue: selectedPhoneType?.toString(),
        onClick: (id) => phoneTypeSelected(Number(id)),
        items: phoneTypeOptions
    };

    const handleOnPhoneClick = () => {
        switch (selectedPhoneType) {
            case ContactPhoneType.mobile:
                if (contact?.mobilePhone) {
                    utils.initiateACall(contact.mobilePhone);
                }
                break;
            case ContactPhoneType.workMain:
                if (contact?.workMainPhone) {
                    utils.initiateACall(contact.workMainPhone);
                }
                break;
            case ContactPhoneType.workDirect:
                if (contact?.workDirectPhone) {
                    utils.initiateACall(contact.workDirectPhone);
                }
                break;
            default:
                break;
        }
    }

    const getIconColor = () => {
        return editMode ? 'contact-subheader-quick-action-second-color' : 'contact-subheader-quick-action-color';
    }

    return (
        <div className='flex justify-center pt-5 items-center'>
            <span className={`pr-3 ${contactHasAnyPhoneOption && !editMode ? 'cursor-pointer' : ''}`} >
                <SvgIcon type={Icon.ChannelPhone}
                         className='icon-x-large'
                         fillClass={getIconColor()}
                         strokeClass='contact-stroke-color'
                         onClick={handleOnPhoneClick}
                         disabled={voiceCounter === 1 || !contactHasAnyPhoneOption || editMode}
                />
            </span>

            <div className='flex items-center' ref={typeDropdownRef}>
                <div
                    onClick={() => {if (contactHasAnyPhoneOption && !editMode) {setDisplayPhoneTypeDropdown(!displayPhoneTypeDropdown)} }}
                    className='flex flex-row'>
                    <div className={`${contactHasAnyPhoneOption && !editMode ? 'contact-phone-type' : 'contact-phone-type-disabled'}`}>
                        {t(`contacts.contact_details.individual.phone_types.${selectedPhoneType}`)}
                    </div>
                    <div className='pl-1.5'>
                        <SvgIcon type={displayPhoneTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                 disabled={voiceCounter === 1}
                                 className={'icon-medium'}
                                 fillClass={`${contactHasAnyPhoneOption ? 'contact-dropdown-arrows' : 'rgba-025-fill'}`} />
                    </div>
                </div>
                {displayPhoneTypeDropdown &&
                    <div className='absolute mt-20'>
                        <Dropdown model={phoneTypeDropdownModel} />
                    </div>}
            </div>

            <span className={'pl-10 pr-8'} >
                <Link
                    className={contact?.mobilePhone ? '' : 'disabled-link'}
                    to={{
                        pathname:contact?.mobilePhone ? `${SmsPath}` : '#',
                        state: {
                            contact
                        }
                    }}>
                    <SvgIcon type={Icon.ChannelSms}
                             disabled={!contact?.mobilePhone}
                             fillClass={contact?.mobilePhone ? 'contact-subheader-quick-action-color' : ''}
                             className='icon-x-large'
                             strokeClass='contact-stroke-color'
                    />
                </Link>
            </span>
            {
                <span className="pr-8">
                     <Link
                         className={contact?.emailAddress ? '' : 'disabled-link'}
                         to={{
                             pathname:contact?.emailAddress ? `${EmailPath}/${NEW_EMAIL}` : '#',
                             state: {
                                 contact
                             }
                         }}>
                     <SvgIcon type={Icon.ChannelEmail}
                              disabled={!contact.emailAddress}
                              className='icon-x-large'
                              fillClass={contact?.emailAddress ? 'contact-subheader-quick-action-color' : ''}
                              strokeClass='contact-stroke-color'
                     /></Link>
                 </span>
            }
        </div>
    )
}
export default ContactCommunicationPanel
