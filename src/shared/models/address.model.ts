import {Option} from '@shared/components/option/option';
export interface Address {
    id?: string;
    country?: string;
    county?: string;
    state?: string | Option;
    zipCode?: string;
    addressType?:  AddressType;
    line?: string;
    city?: string;
}

export enum AddressType {
    BillingAddress = 1,
    ShippingAddress = 2,
    PrimaryAddress = 3
}

export const determineAddressTranslation = (address: AddressType) => {
    switch (address) {
        case AddressType.PrimaryAddress:
            return 'address';
        case AddressType.ShippingAddress:
            return 'shipping_address';
        case AddressType.BillingAddress:
            return 'billing_address';
    }
}
