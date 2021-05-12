import {Address, AddressType} from '@shared/models/address.model';
import {ContactExtended} from '@shared/models/contact.model';
import {ContactFormModel} from '../models/contact-form.model';

export const mapContactFormModelToDto = (formModel: ContactFormModel, type: number, contactId?: string, addToFavorites?: boolean): ContactExtended => {
    const addresses = createContactAddressArray(formModel);
    const contact: ContactExtended = {
        ...(contactId && {id: contactId}),
        ...(formModel.firstName && {firstName: formModel.firstName}),
        ...(formModel.lastName && {lastName: formModel.lastName}),
        category: Number(formModel.category),
        ...(formModel.companyName && {companyName: formModel.companyName}),
        ...(formModel.relatedId && {relatedId: formModel.relatedId}),
        ...(formModel.jobTitle && {jobTitle: formModel.jobTitle}),
        ...(formModel.department && {department: formModel.department}),
        ...(formModel.email && {emailAddress: formModel.email}),
        ...(formModel.workMainPhone && {workMainPhone: formModel.workMainPhone}),
        ...(formModel.workMainExtension && {workMainExtension: formModel.workMainExtension}),
        ...(formModel.workDirectPhone && {workDirectPhone: formModel.workDirectPhone}),
        ...(formModel.mobile && {mobilePhone: formModel.mobile}),
        ...(formModel.fax && {fax: formModel.fax}),
        ...(formModel.website && {website: formModel.website}),
        ...(addresses && addresses.length && {addresses}),
        type,
        ...(addToFavorites && {addToFavorites: addToFavorites}),
        ...(formModel.isStarred && {isStarred: formModel.isStarred}),
        ...(formModel.isStarred && !addToFavorites && {addToFavorites: formModel.isStarred})
    }
    return contact;
}

const createContactAddressArray = (formModel: ContactFormModel): Address[] => {
    const addresses: Address[] = [];

    if (formModel?.primaryState) {
        addresses.push({
            addressType: AddressType.PrimaryAddress,
            state: formModel.primaryState,
            ...(formModel.primaryAddressLine && {line: formModel.primaryAddressLine}),
            ...(formModel.primaryCity && {city: formModel.primaryCity}),
            ...(formModel.primaryZipCode && {zipCode: formModel.primaryZipCode})
        })
    }
    if (formModel?.shippingState) {
        addresses.push({
            addressType: AddressType.ShippingAddress,
            state: formModel.shippingState,
            ...(formModel.shippingAddressLine && {line: formModel.shippingAddressLine}),
            ...(formModel.shippingCity && {city: formModel.shippingCity}),
            ...(formModel.shippingZipCode && {zipCode: formModel.shippingZipCode})
        })
    }
    if (formModel?.billingState) {
        addresses.push({
            addressType: AddressType.BillingAddress,
            state: formModel.billingState,
            ...(formModel.billingAddressLine && {line: formModel.billingAddressLine}),
            ...(formModel.billingCity && {city: formModel.billingCity}),
            ...(formModel.billingZipCode && {zipCode: formModel.billingZipCode})
        })
    }
    return addresses;
}