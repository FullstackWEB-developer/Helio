import {Icon} from '@components/svg-icon/icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import ContactInfoField from './contact-info-field';
import ContactForm from './contact-form';
import {ContactType} from '@shared/models/contact-type.enum';
import {ContactExtended} from '@shared/models/contact.model';
import {getCategoryName} from '@shared/models/contact-category.enum';
import utils from '@shared/utils/utils';
import {AddressType, determineAddressTranslation} from '@shared/models/address.model';
import {mapContactFormModelToDto} from '../contact-helpers/helpers';
import {useMutation} from 'react-query';
import {updateContact} from '@shared/services/contacts.service';
interface IndividualContactDetailsProps {
    contact: ContactExtended;
    editMode?: boolean;
    initiateACall?: (phoneToDial?: string) => void,
    closeEditMode?: () => void,
    onUpdateSuccess: (contact: ContactExtended) => void,
    onUpdateError?: () => void
}
const IndividualContactDetails = ({contact, editMode, initiateACall, closeEditMode, onUpdateSuccess, onUpdateError}: IndividualContactDetailsProps) => {
    const {t} = useTranslation();
    const displayValue = (value: string | undefined, isPhone = false) => {
        return value ? isPhone ? utils.formatPhone(value) : value : t('common.not_available');
    }
    const renderAddressField = (addressType: AddressType) => {
        const address = contact.addresses?.find(a => a.addressType === addressType);
        return address ? (
            <>
                <ContactInfoField label={t(`contacts.contact-details.individual.${determineAddressTranslation(addressType)}`)}
                    value={displayValue(address.line)} />
                <ContactInfoField value={`${address.city || ''}${address.state ? ', ' : ''} ${address.state || ''} ${address.zipCode || ''}`} />
            </>
        ) : null
    }

    const updateContactMutation = useMutation(updateContact,
        {
            onSuccess: (_, contact) => {
                onUpdateSuccess(contact);
            },
            onError: () => onUpdateError && onUpdateError()
        });

    const onSubmit = (formData: ContactExtended) => {
        const contactDto = mapContactFormModelToDto(formData, ContactType.Individual, contact?.id);
        updateContactMutation.mutate(contactDto);
    }

    const phoneIconOnClick = (phoneNumber?: string) => {
        if (initiateACall)
            initiateACall(phoneNumber);
    }
    return (
        <>
            {updateContactMutation.isError && <h6 className='text-danger mt-2 mb-5'>{t('contacts.contact-details.error_updating_contact')}</h6>}
            {!editMode ?
                (
                    <div className="grid grid-cols-8 gap-2 body2">
                        <ContactInfoField label={`${t('contacts.contact-details.individual.company')}`} value={displayValue(contact.companyName)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.category')}`} value={getCategoryName(contact.category)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.department')}`} value={displayValue(contact.department)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.email')}`} value={displayValue(contact.emailAddress)} icon={Icon.Email} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.work_main_phone')}`} value={displayValue(contact.workMainPhone, true)} icon={Icon.Phone} appendix={true}
                            appendixLabel={t('contacts.contact-details.individual.ext')} appendixValue={contact.workMainExtension} iconOnClick={() => phoneIconOnClick(contact.workMainPhone)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.work_direct_phone')}`} value={displayValue(contact.workDirectPhone, true)}
                            icon={Icon.Phone} iconOnClick={() => phoneIconOnClick(contact.workDirectPhone)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.mobile_phone')}`} value={displayValue(contact.mobilePhone, true)}
                            icon={Icon.Phone} iconOnClick={() => phoneIconOnClick(contact.mobilePhone)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.fax')}`} value={displayValue(contact.fax, true)}
                            icon={Icon.Phone} iconOnClick={() => phoneIconOnClick(contact.fax)} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.website')}`} value={displayValue(contact.website)} />
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
                )
                :
                <ContactForm isSaving={updateContactMutation.isLoading} contactType={ContactType.Individual} contact={contact}
                            submitHandler={onSubmit} closeHandler={closeEditMode} editMode={true} />
            }
        </>
    )
}
export default IndividualContactDetails;
