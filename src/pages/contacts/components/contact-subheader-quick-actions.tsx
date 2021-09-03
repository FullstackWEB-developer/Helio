import React, {useRef, useState} from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
import Dropdown from '@components/dropdown/dropdown';
import {useTranslation} from 'react-i18next';
import customHooks from '@shared/hooks/customHooks';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {ContactPhoneType} from '@pages/contacts/enums/contact-phone-type.enum';
import {showCcp} from '@shared/layout/store/layout.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {useDispatch, useSelector} from 'react-redux';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Logger from '@shared/services/logger';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';

interface ContactHeaderQuickActionsProps {
    editMode?: boolean;
    editIconClickHandler?: () => void;
    contact: ContactExtended;
    deleteIconClickHandler?: () => void;
    isLoading: boolean;
}

const ContactSubheaderQuickActions = ({editMode, editIconClickHandler, contact, isLoading, deleteIconClickHandler}: ContactHeaderQuickActionsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const voiceCounter = useSelector(selectVoiceCounter);
    const logger = Logger.getInstance();

    const [displayPhoneTypeDropdown, setDisplayPhoneTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);

    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayPhoneTypeDropdown(false);
    });

    const phoneTypeSelected = (type: ContactPhoneType) => {
        setDisplayPhoneTypeDropdown(false);
        setSelectedPhoneType(type);
    }

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

    const contactHasAnyPhoneOption = contact?.mobilePhone || contact?.workDirectPhone || contact?.workMainPhone;
    const phoneTypeOptions = generatePhoneTypeDropdownOptions();
    const [selectedPhoneType, setSelectedPhoneType] = useState<ContactPhoneType>(phoneTypeOptions?.length > 0 ? Number(phoneTypeOptions[0].value) : ContactPhoneType.mobile);
    const phoneTypeDropdownModel: DropdownModel = {
        defaultValue: selectedPhoneType?.toString(),
        onClick: (id) => phoneTypeSelected(Number(id)),
        items: phoneTypeOptions
    };

    const handleOnPhoneClick = () => {
        switch (selectedPhoneType) {
            case ContactPhoneType.mobile:
                if (contact?.mobilePhone) {
                    initiateACall(contact.mobilePhone);
                }
                break;
            case ContactPhoneType.workMain:
                if (contact?.workMainPhone) {
                    initiateACall(contact.workMainPhone);
                }
                break;
            case ContactPhoneType.workDirect:
                if (contact?.workDirectPhone) {
                    initiateACall(contact.workDirectPhone);
                }
                break;
            default:
                break;
        }
    }

    const initiateACall = (phoneToDial?: string) => {
        dispatch(showCcp());
        if (window.CCP.agent && phoneToDial) {
            const endpoint = connect.Endpoint.byPhoneNumber(phoneToDial);
            window.CCP.agent.connect(endpoint, {
                failure: (e: any) => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'contacts.contact_details.error_dialing_phone'
                    }));

                    logger.error(t('contacts.contact_details.error_dialing_phone'), e);
                }
            })
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
                <SvgIcon type={Icon.ChannelSms}
                    disabled={true}
                    className='icon-x-large'
                    strokeClass='contact-stroke-color'
                />
            </span>
            {
                // PLEASE DON'T DELETE THIS
                // <span className="pr-8">
                //     <SvgIcon type={Icon.ChannelEmail}
                //         disabled={true}
                //         className='icon-x-large'
                //         strokeClass='contact-stroke-color'
                //     />
                // </span>
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
