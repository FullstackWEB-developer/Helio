import React from 'react';
import ContactInfoField from './contact-info-field';
import AssociatedContacts from './associated-contacts';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/svg-icon/icon';
import { ContactExtended } from '@shared/models/contact.model';
import SvgIcon from '@components/svg-icon/svg-icon';
import { ContactType } from '@shared/models/contact-type.enum';
import ContactForm from './contact-form';
import utils from '@shared/utils/utils';
import { AddressType, determineAddressTranslation } from '@shared/models/address.model';
import { mapContactFormModelToDto } from '../contact-helpers/helpers';
import { useMutation } from 'react-query';
import { updateContact } from '@shared/services/contacts.service';
import '../contacts.scss';
import { useSelector } from 'react-redux';
import { selectVoiceCounter } from '@pages/ccp/store/ccp.selectors';
import { selectLookupValues } from '@pages/tickets/store/tickets.selectors';
import { Option } from '@components/option/option';
import { EmailPath } from '@app/paths';
import { NEW_EMAIL } from '@pages/email/constants';
import { useHistory } from 'react-router-dom';

interface CompanyContactDetailsProps {
    contact: ContactExtended,
    editMode?: boolean,
    initiateACall?: (phoneNumberToDial?: string) => void,
    addNewContactHandler: () => void,
    closeEditMode?: () => void,
    onUpdateSuccess: (contact: ContactExtended) => void,
    onUpdateError?: () => void
}
const CompanyContactDetails = ({ editMode, contact, initiateACall, addNewContactHandler, closeEditMode, onUpdateSuccess, onUpdateError }: CompanyContactDetailsProps) => {
    const { t } = useTranslation();
    const facilityTypes = useSelector(state => selectLookupValues(state, 'ContactCategory'));
    const voiceCounter = useSelector(selectVoiceCounter);
    const history = useHistory();
    const displayValue = (value: string | undefined, isPhone = false) => {
        return value ? isPhone ? utils.formatPhone(value) : value : t('common.not_available');
    }
    const renderAddressField = (addressType: AddressType) => {
        const address = contact.addresses?.find(a => a.addressType === addressType);
        return address ?
            <ContactInfoField label={t(`contacts.contact_details.individual.${determineAddressTranslation(addressType)}`)}
                value={`${displayValue(address.line)}\n${address.city || ''}${address.state ? ', ' : ''} ${address.state || ''} ${address.zipCode || ''}`} />
            : null
    }
    const updateContactMutation = useMutation(updateContact,
        {
            onSuccess: (_, contact) => {
                onUpdateSuccess(contact);
            },
            onError: () => onUpdateError && onUpdateError()
        });
    const onSubmit = (formData: ContactExtended) => {
        const contactDto = mapContactFormModelToDto(formData, ContactType.Company, contact?.id);
        updateContactMutation.mutate(contactDto);
    }

    const phoneIconOnClick = (phoneNumber?: string) => {
        if (initiateACall)
            initiateACall(phoneNumber);
    }

    const getIconFillClass = (value?: string) => {
        return !!value ? 'success-icon' : '';
    }

    const getCategoryName = (category: number | Option) => {
        const calculated = category && category.hasOwnProperty('value') ? (category as Option).value : category?.toString();
        if (!calculated) {
            return '';
        }
        return facilityTypes.filter(a => a.value === calculated).length > 0 ? facilityTypes.filter(a => a.value === calculated)[0].label : '';
    };

    const emailOnClick = () => {
        const pathName = `${EmailPath}/${NEW_EMAIL}`;
        history.push({
            pathname: pathName,
            state: {
                contact
            }
        });
    }

    return (
        <>
            {
                !editMode ?
                    (
                        <>
                            <div className="grid grid-cols-8 gap-2 body2 mb-10">
                                <ContactInfoField label={`${t('contacts.contact_details.company.category')}`}
                                    value={getCategoryName(contact.category)} />
                                <ContactInfoField label={`${t('contacts.contact_details.company.email')}`}
                                    iconFillClass={getIconFillClass(contact.emailAddress)}
                                    value={displayValue(contact.emailAddress)}
                                    icon={Icon.Email}
                                    onValueClick={emailOnClick}
                                    iconOnClick={emailOnClick}
                                    isIconDisabled={!contact.emailAddress} />
                                <ContactInfoField label={`${t('contacts.contact_details.company.work_main_phone')}`}
                                    iconFillClass={getIconFillClass(contact.workMainPhone)}
                                    value={displayValue(contact.workMainPhone, true)}
                                    isIconDisabled={voiceCounter > 0 || !contact.workMainPhone}
                                    icon={Icon.Phone}
                                    iconOnClick={() => phoneIconOnClick(contact.workMainPhone)}
                                    isValueClickDisabled={voiceCounter > 0 || !contact.workMainPhone}
                                    onValueClick={() => phoneIconOnClick(contact.workMainPhone)}
                                    isLink={!(voiceCounter > 0 || !contact.workMainPhone)} />
                                <ContactInfoField label={`${t('contacts.contact_details.company.mobile_phone')}`}
                                    iconFillClass={getIconFillClass(contact.mobilePhone)}
                                    value={displayValue(contact.mobilePhone, true)}
                                    isIconDisabled={voiceCounter > 0 || !contact.mobilePhone}
                                    icon={Icon.Phone}
                                    iconOnClick={() => phoneIconOnClick(contact.mobilePhone)}
                                    onValueClick={() => phoneIconOnClick(contact.mobilePhone)}
                                    isLink={!(voiceCounter > 0 || !contact.mobilePhone)}
                                    isValueClickDisabled={voiceCounter > 0 || !contact.mobilePhone} />
                                <ContactInfoField label={`${t('contacts.contact_details.company.fax')}`}
                                    value={displayValue(contact.fax, true)}
                                    icon={Icon.Phone}
                                    isIconDisabled={true} />
                                <ContactInfoField label={`${t('contacts.contact_details.company.website')}`}
                                    value={displayValue(contact.website)}
                                    onValueClick={() => contact.website && utils.openWebSite(contact.website)}
                                    isLink={!!contact?.website} />
                                {
                                    renderAddressField(AddressType.PrimaryAddress)
                                }
                                {
                                    renderAddressField(AddressType.ShippingAddress)
                                }
                                {
                                    renderAddressField(AddressType.BillingAddress)
                                }
                            </div>
                            {
                                contact?.associatedContacts && contact.associatedContacts.length > 0 && <AssociatedContacts contacts={contact.associatedContacts} />
                            }
                            <div className='flex items-center body2 pt-5'>
                                <span className='pr-4'><SvgIcon type={Icon.AddContact} fillClass='contact-light-fill' /></span>
                                <span className='contact-accent-color cursor-pointer' onClick={() => addNewContactHandler()}>
                                    {t('contacts.contact_details.company.add_contact')}
                                </span>
                            </div>
                        </>
                    ) :
                    <ContactForm isSaving={updateContactMutation.isLoading} contactType={ContactType.Company} contact={contact} submitHandler={onSubmit} closeHandler={closeEditMode} editMode={true} />
            }
        </>

    )
}

export default CompanyContactDetails;
