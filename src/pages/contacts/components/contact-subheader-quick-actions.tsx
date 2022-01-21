import React, {useMemo, useRef, useState} from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
import Dropdown from '@components/dropdown/dropdown';
import {useTranslation} from 'react-i18next';
import customHooks from '@shared/hooks/customHooks';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {ContactPhoneType} from '@pages/contacts/enums/contact-phone-type.enum';
import {useSelector} from 'react-redux';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import { Link } from 'react-router-dom';
import {EmailPath, SmsPath} from '@app/paths';
import utils from '@shared/utils/utils';
import {EMPTY_GUID} from '@pages/email/constants';

interface ContactHeaderQuickActionsProps {
    editMode?: boolean;
    editIconClickHandler?: () => void;
    contact: ContactExtended;
    deleteIconClickHandler?: () => void;
    isLoading: boolean;
}

const ContactSubheaderQuickActions = ({editMode, editIconClickHandler, contact, isLoading, deleteIconClickHandler}: ContactHeaderQuickActionsProps) => {
    const {t} = useTranslation();
    const voiceCounter = useSelector(selectVoiceCounter);

    const [displayPhoneTypeDropdown, setDisplayPhoneTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const [phoneTypeOptions, setPhoneTypeOptions] = useState<DropdownItemModel[]>([]);
    const [selectedPhoneType, setSelectedPhoneType] = useState<ContactPhoneType>(phoneTypeOptions?.length > 0 ? Number(phoneTypeOptions[0].value) : ContactPhoneType.mobile);
    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayPhoneTypeDropdown(false);
    });

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
        <div className='flex justify-center pt-5'>
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
                         pathname:contact?.emailAddress ? `${EmailPath}/${EMPTY_GUID}` : '#',
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
            {!editMode && <span className="pr-8 cursor-pointer" onClick={editIconClickHandler}>
                <SvgIcon type={Icon.EditCircled}
                    className='icon-x-large'
                    fillClass='contact-subheader-quick-action-color'
                    strokeClass='contact-stroke-color'
                />
            </span>}
            <span className="pr-8 cursor-pointer" onClick={deleteIconClickHandler}>
                <SvgIcon type={Icon.DeleteCircled}
                    className='icon-x-large'
                    fillClass='contact-subheader-quick-action-color'
                    strokeClass='contact-stroke-color'
                    isLoading={isLoading}
                />
            </span>
        </div>
    )
}

export default ContactSubheaderQuickActions;
