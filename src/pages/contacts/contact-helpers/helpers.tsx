import {Address, AddressType} from '@shared/models/address.model';
import {ContactExtended} from '@shared/models/contact.model';
import {ContactFormModel} from '../models/contact-form.model';


const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_MAX_SCREEN_HEIGHT_SIZE = 1300;

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
        type
    }

    if (formModel.workDirectPhone) {
        contact.workDirectPhone = formModel.workDirectPhone;
    }

    if (formModel.mobile) {
        contact.mobilePhone = formModel.mobile;
    }

    if (formModel.fax) {
        contact.fax = formModel.fax;
    }

    if (formModel.website) {
        contact.website = formModel.website;
    }

    if (addresses && addresses.length) {
        contact.addresses = addresses;
    }

    if (addToFavorites) {
        contact.addToFavorites = addToFavorites;
    }

    if (formModel.isStarred) {
        contact.isStarred = formModel.isStarred;
    }

    if (formModel.isStarred && !addToFavorites) {
        contact.addToFavorites = formModel.isStarred;
    }

    return contact;
}

const createContactAddressArray = (formModel: ContactFormModel): Address[] => {
    const addresses: Address[] = [];

    if (formModel?.primaryState || formModel?.primaryAddressLine || formModel?.primaryCity || formModel?.primaryZipCode || formModel?.primaryApt) {
        addresses.push({
            addressType: AddressType.PrimaryAddress,
            state: formModel.primaryState,
            ...(formModel.primaryAddressLine && {line: formModel.primaryAddressLine}),
            ...(formModel.primaryCity && {city: formModel.primaryCity}),
            ...(formModel.primaryZipCode && {zipCode: formModel.primaryZipCode}),
            ...(formModel.primaryApt && {apartmentNumber: formModel.primaryApt})
        })
    }
    if (formModel?.shippingState || formModel?.shippingAddressLine || formModel?.shippingCity || formModel?.shippingZipCode || formModel?.shippingApt) {
        addresses.push({
            addressType: AddressType.ShippingAddress,
            state: formModel.shippingState,
            ...(formModel.shippingAddressLine && {line: formModel.shippingAddressLine}),
            ...(formModel.shippingCity && {city: formModel.shippingCity}),
            ...(formModel.shippingZipCode && {zipCode: formModel.shippingZipCode}),
            ...(formModel.shippingApt && {apartmentNumber: formModel.shippingApt})
        })
    }
    if (formModel?.billingState || formModel?.billingAddressLine || formModel?.billingCity || formModel?.billingZipCode || formModel?.billingApt) {
        addresses.push({
            addressType: AddressType.BillingAddress,
            state: formModel.billingState,
            ...(formModel.billingAddressLine && {line: formModel.billingAddressLine}),
            ...(formModel.billingCity && {city: formModel.billingCity}),
            ...(formModel.billingZipCode && {zipCode: formModel.billingZipCode}),
            ...(formModel.billingApt && {apartmentNumber: formModel.billingApt})

        })
    }
    return addresses;
}


export const getPageSize = () => {
    const currentScreenHeight = window.innerHeight;

    if (currentScreenHeight <= DEFAULT_MAX_SCREEN_HEIGHT_SIZE) {
        return DEFAULT_PAGE_SIZE;
    }

    const result = DEFAULT_PAGE_SIZE + (currentScreenHeight - DEFAULT_MAX_SCREEN_HEIGHT_SIZE) * (DEFAULT_PAGE_SIZE / DEFAULT_MAX_SCREEN_HEIGHT_SIZE);
    return Math.round(result);
}
