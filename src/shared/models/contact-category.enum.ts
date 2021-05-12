import {getI18n} from "react-i18next";
import {Option} from '@shared/components/option/option';

export enum ContactCategory {
    Hospitals = 1,
    Pharmacies,
    Providers,
    Suppliers
}

const translate = getI18n();

export const getCategoryName = (category: ContactCategory | Option) => {
    switch (category) {
        case ContactCategory.Hospitals:
            return translate.t('contacts.category.hospitals');
        case ContactCategory.Pharmacies:
            return translate.t('contacts.category.pharmacies');
        case ContactCategory.Providers:
            return translate.t('contacts.category.providers');
        case ContactCategory.Suppliers:
            return translate.t('contacts.category.suppliers');
        default:
            return translate.t('common.not_available');
    }
}

export const createCategorySelectOptions = () :Option[] => {
    return [
        {value: String(ContactCategory.Hospitals), label: translate.t('contacts.category.hospitals')},
        {value: String(ContactCategory.Pharmacies), label: translate.t('contacts.category.pharmacies')},
        {value: String(ContactCategory.Providers), label: translate.t('contacts.category.providers')},
        {value: String(ContactCategory.Suppliers), label: translate.t('contacts.category.suppliers')}
    ];
}