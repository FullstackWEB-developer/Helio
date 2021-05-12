import React from 'react';
import ContactInfoField from './contact-info-field';
import AssociatedContacts from './associated-contacts';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
import SvgIcon from '@components/svg-icon/svg-icon';
import {ContactType} from '../../../shared/models/contact-type.enum';
import ContactForm from './contact-form';
import utils from '@shared/utils/utils';
import {getCategoryName} from '@shared/models/contact-category.enum';
import {AddressType, determineAddressTranslation} from '@shared/models/address.model';
import {mapContactFormModelToDto} from '../contact-helpers/helpers';
import {useMutation} from 'react-query';
import {updateContact} from '@shared/services/contacts.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
interface CompanyContactDetailsProps {
    contact: ContactExtended,
    editMode?: boolean,
    initiateACall?: (phoneNumberToDial?: string) => void,
    addNewContactHandler: () => void,
    closeEditMode?: () => void,
    onUpdateSuccess: (contact: ContactExtended) => void,
    onUpdateError?: () => void
}
const CompanyContactDetails = ({editMode, contact, initiateACall, addNewContactHandler, closeEditMode, onUpdateSuccess, onUpdateError}: CompanyContactDetailsProps) => {
    const {t} = useTranslation();
    const displayValue = (value: string | undefined, isPhone = false) => {
        return value ? isPhone ? utils.formatPhone(value) : value : t('common.not_available');
    }
    const renderAddressField = (addressType: AddressType) => {
        const address = contact.addresses?.find(a => a.addressType === addressType);
        return address ? (
            <>
                <ContactInfoField label={`${t(`contacts.contact-details.individual.${determineAddressTranslation(addressType)}`)}`}
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
        const contactDto = mapContactFormModelToDto(formData, ContactType.Company, contact?.id);
        updateContactMutation.mutate(contactDto);
    }
    const phoneIconOnClick = (phoneNumber?: string) => {
        if (initiateACall)
            initiateACall(phoneNumber);
    }
    return (
        <>
            {updateContactMutation.isError && <h6 className='text-danger mt-2 mb-5'>{t('contacts.contact-details.error_updating_contact')}</h6>}
            {
                !editMode ?
                    (
                        <>
                            <div className="grid grid-cols-8 gap-2 body2 mb-10">
                                <ContactInfoField label={`${t('contacts.contact-details.individual.category')}`} value={getCategoryName(contact.category)} />
                                <ContactInfoField label={`${t('contacts.contact-details.individual.email')}`} value={displayValue(contact.emailAddress)}
                                    icon={Icon.Email} />
                                <ContactInfoField label={`${t('contacts.contact-details.individual.work_main_phone')}`} value={displayValue(contact.workMainPhone, true)}
                                    icon={Icon.Phone} iconOnClick={() => phoneIconOnClick(contact.workMainPhone)} />
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
                            {
                                contact?.associatedContacts && contact.associatedContacts.length > 0 && <AssociatedContacts contacts={contact.associatedContacts} />
                            }
                            <div className='flex items-center cursor-pointer body2 pt-5' onClick={addNewContactHandler}>
                                <span className='pr-4'><SvgIcon type={Icon.AddContact} fillClass='contact-light-fill' /></span>
                                {t('contacts.contact-details.company.add_contact')}
                            </div>
                        </>
                    ) :
                    (
                        updateContactMutation.isLoading ? <ThreeDots /> :
                            <ContactForm contactType={ContactType.Company} contact={contact} submitHandler={onSubmit} closeHandler={closeEditMode} editMode={true} />
                    )
            }
        </>

    )
}

export default CompanyContactDetails;