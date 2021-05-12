import {Option} from "@components/option/option";

export interface ContactFormModel {
    id?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    category: number | Option;
    jobTitle?: string;
    department?: string;
    email?: string;
    workMainPhone?: string;
    workMainExtension?: string;
    workDirectPhone?: string;
    mobile?: string;
    fax?: string;
    website?: string;
    primaryAddressLine?: string;
    primaryApt?: string;
    primaryCity?: string;
    primaryState?: string | Option;
    primaryZipCode?: string;
    shippingAddressLine?: string;
    shippingApt?: string;
    shippingCity?: string;
    shippingState?: string | Option;
    shippingZipCode?: string;
    billingAddressLine?: string;
    billingApt?: string;
    billingCity?: string;
    billingState?: string | Option;
    billingZipCode?: string;
    isStarred?: boolean;
    relatedId?: string;
}