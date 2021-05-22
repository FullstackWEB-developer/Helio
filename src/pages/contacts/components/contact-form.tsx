import Button from '@components/button/button';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ContactType} from '../../../shared/models/contact-type.enum';
import ContactAddressPicker from './contact-address-picker';
import {Option} from '@components/option/option';
import ContactAddress from './contact-address';
import {useForm} from 'react-hook-form';
import ControlledInput from '@components/controllers/ControllerInput';
import {createCategorySelectOptions} from '@shared/models/contact-category.enum';
import {Address, AddressType} from '@shared/models/address.model';
import {ContactFormModel} from '../models/contact-form.model';
import {ContactBase, ContactExtended} from '@shared/models/contact.model';
import utils from '@shared/utils/utils';
import {useQuery} from 'react-query';
import {searchCompanyContacts} from '@shared/services/contacts.service';
import {QueryCompanyContacts} from '@constants/react-query-constants';
import useDebounce from '@shared/hooks/useDebounce';
import {DEBOUNCE_SEARCH_DELAY_MS} from '@constants/form-constants';
import ControlledSelect from '@components/controllers/controlled-select';

const SHIPPING_ADDRESS_LABEL_KEY = 'contacts.contact-details.individual.shipping_address'
const BILLING_ADDRESS_LABEL_KEY = 'contacts.contact-details.individual.billing_address';

interface ContactFormProps {
    contactType: ContactType;
    contact?: ContactExtended;
    submitHandler?: (formData: ContactFormModel) => void;
    closeHandler?: () => void;
    editMode: boolean;
}
const ContactForm = ({contact, contactType, submitHandler, closeHandler, editMode}: ContactFormProps) => {
    const {t} = useTranslation();
    const mask = '(999) 999-9999';
    const isCompanyContact = contactType === ContactType.Company;
    const shouldCompanyFieldBeAutosuggest = contactType !== ContactType.Company;

    const shippingAddressOption: Option = {
        label: `${t(SHIPPING_ADDRESS_LABEL_KEY)}`,
        value: `${t(SHIPPING_ADDRESS_LABEL_KEY)}`
    };
    const billingAddressOption: Option = {
        label: `${t(BILLING_ADDRESS_LABEL_KEY)}`,
        value: `${t(BILLING_ADDRESS_LABEL_KEY)}`
    };
    const createInitialAddressDropdownOptions = () => {
        if (!editMode) {
            return [shippingAddressOption, billingAddressOption];
        }
        else {
            const options: Option[] = [];
            let hasShipping = false;
            let hasBilling = false;
            if (contact?.addresses?.some(address => address.addressType === AddressType.ShippingAddress)) {
                hasShipping = true;
            }

            if (contact?.addresses?.some(address => address.addressType === AddressType.BillingAddress)) {
                hasBilling = true;
            }

            if (!hasShipping) {
                options.push(shippingAddressOption);
            }

            if (!hasBilling) {
                options.push(billingAddressOption);
            }

            return options;
        }
    }
    const [addressDropdownOptions, setAddressDropdownOptions] = useState<Option[]>(createInitialAddressDropdownOptions());
    const handleAddressPickerChange = (id: string) => {
        setAddressDropdownOptions(addressDropdownOptions.filter(o => o.value !== id));
    }
    const showAddressSection = (value: string) => {
        return !addressDropdownOptions.some(o => o.label === value);
    }
    const handleRemoveCTABtnClick = (value: Option) => {
        setAddressDropdownOptions([...addressDropdownOptions, value]);
    }
    const {handleSubmit, control, reset, formState, errors, setValue} = useForm({mode: 'onChange'});
    const {isValid} = formState;
    const categoryOptions = createCategorySelectOptions();
    const defaultCategory = contact?.category ? categoryOptions?.find(c => Number(c.value) === contact.category) : '';
    const defaultPrimaryAddress: Address | undefined = (contact?.addresses?.some(a => a.addressType === AddressType.PrimaryAddress)) ?
        (contact.addresses.find(a => a.addressType === AddressType.PrimaryAddress)) : undefined;
    const defaultShippingAddress: Address | undefined = (contact?.addresses?.some(a => a.addressType === AddressType.ShippingAddress)) ?
        (contact.addresses.find(a => a.addressType === AddressType.ShippingAddress)) : undefined;
    const defaultBillingAddress: Address | undefined = (contact?.addresses?.some(a => a.addressType === AddressType.BillingAddress)) ?
        (contact.addresses.find(a => a.addressType === AddressType.BillingAddress)) : undefined;
    useEffect(() => {
        reset();
    }, [contactType]);

    const onSubmit = (form: ContactFormModel) => {
        form = {
            ...form,
            category: utils.isString(form.category) ? form.category : Number((form.category as Option).value),
            primaryState: form.primaryState ?
                (
                    utils.isString(form.primaryState) ?
                        form.primaryState : (form.primaryState as Option).value
                )
                : '',
            shippingState: form.shippingState ?
                (
                    utils.isString(form.shippingState) ?
                        form.shippingState : (form.shippingState as Option).value
                )
                : '',
            billingState: form.billingState ?
                (
                    utils.isString(form.billingState) ?
                        form.billingState : (form.billingState as Option).value
                )
                : '',
            ...(selectedCompany && selectedCompany.value && selectedCompany.label &&
            {
                companyName: selectedCompany.label,
                relatedId: selectedCompany.value
            }),
            isStarred: contact?.isStarred
        }
        if (submitHandler) {
            submitHandler(form);
        }
    }

    const closeButtonHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (closeHandler) {
            closeHandler();
        }
    }

    const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
    const [debounceCompanySearchTerm] = useDebounce(searchCompanyTerm, DEBOUNCE_SEARCH_DELAY_MS);
    const [companyOptions, setCompanyOptions] = useState<Option[]>([]);
    const defaultCompanySelected = contact?.companyName && contact?.relatedId ?
        {label: contact.companyName, value: contact.relatedId} : undefined;
    const [selectedCompany, setSelectedCompany] = useState<Option | undefined>(defaultCompanySelected);
    const selectAutoSuggestedCompany = (company: Option) => {
        setValue('companyName', company.label);
        setSelectedCompany(company);
    }
    const onCompanyChange = (value: string) => {
        if (!shouldCompanyFieldBeAutosuggest) {
            return;
        }
        setSearchCompanyTerm(value);
        if (value.length === 0) {
            setCompanyOptions([]);
            setSelectedCompany(undefined);
        }

    }
    useEffect(() => {
        if (debounceCompanySearchTerm.trim().length > 0) {
            refetchCompanySuggestions();
        }
    }, [debounceCompanySearchTerm]);

    const {refetch: refetchCompanySuggestions, isLoading: isLoadingCompanySuggestions, isFetching: isFetchingCompanySuggestions}
        = useQuery(QueryCompanyContacts, () => searchCompanyContacts(searchCompanyTerm),
            {
                enabled: false,
                onSuccess: data => {
                    if (data?.results && data.results.length > 0) {
                        const contacts = data.results.map((contactBase: ContactBase) => ({label: contactBase.companyName, value: contactBase.id}));
                        setCompanyOptions(contacts);
                    }
                }
            });

    const companyFieldOnBlur = () => {
        if (!shouldCompanyFieldBeAutosuggest) {
            return;
        }
        if (!selectedCompany || !selectedCompany.value || !selectedCompany.label) {
            setValue('companyName', contact?.companyName || '');
            setCompanyOptions([]);
        }
    }

    return (
        <div className={`flex flex-col ${editMode ? 'overflow-hidden' : ''}`}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                    {
                        !isCompanyContact &&
                        (
                            <>
                                <div className="col-span-12 lg:col-span-5">
                                    <ControlledInput name='firstName' control={control}
                                        defaultValue={contact?.firstName || ''} label={t('contacts.contact-details.individual.first_name')}
                                        required={true} dataTestId={'contact-first-name'} />
                                </div>
                                <div className="col-span-12 lg:col-span-5">
                                    <ControlledInput name='lastName' control={control}
                                        defaultValue={contact?.lastName || ''} label={t('contacts.contact-details.individual.last_name')}
                                        required={true} dataTestId={'contact-last-name'} />
                                </div>
                            </>
                        )
                    }
                    <div className="col-span-12 lg:col-span-5">
                        <ControlledInput name='companyName' control={control}
                            defaultValue={contact?.companyName || ''} label={t('contacts.contact-details.individual.company')}
                            required={isCompanyContact} dataTestId={'contact-company-name'}
                            autosuggestDropdown={shouldCompanyFieldBeAutosuggest}
                            autosuggestOptions={shouldCompanyFieldBeAutosuggest ? companyOptions : undefined}
                            onDropdownSuggestionClick={shouldCompanyFieldBeAutosuggest ? selectAutoSuggestedCompany : undefined}
                            onChange={(e) => onCompanyChange(e.target.value)}
                            isFetchingSuggestions={shouldCompanyFieldBeAutosuggest ? (isLoadingCompanySuggestions || isFetchingCompanySuggestions) : undefined}
                            selectedSuggestion={shouldCompanyFieldBeAutosuggest ? selectedCompany : undefined}
                            fetchingSuggestionsPlaceholder={'contacts.contact-details.company_search_placeholder'}
                            onBlur={companyFieldOnBlur}

                        />
                    </div>
                    <div className="col-span-12 lg:col-span-5">
                        <ControlledSelect
                            name='category'
                            defaultValue={defaultCategory}
                            control={control}
                            label='contacts.contact-details.individual.category'
                            options={categoryOptions}
                            required={true}
                            autoComplete={false}
                        />
                    </div>
                    {
                        !isCompanyContact && (
                            <>
                                <div className="col-span-12 lg:col-span-5">
                                    <ControlledInput name='jobTitle' control={control}
                                        defaultValue={contact?.jobTitle || ''} label={t('contacts.contact-details.individual.job_title')}
                                        dataTestId={'contact-job-title'}
                                    />
                                </div>
                                <div className="col-span-12 lg:col-span-5">
                                    <ControlledInput name='department' control={control}
                                        defaultValue={contact?.department || ''} label={t('contacts.contact-details.individual.department')}
                                        dataTestId={'contact-department'}
                                    />
                                </div>
                            </>
                        )
                    }
                    <div className="col-span-12 lg:col-span-5">
                        <ControlledInput name='email' control={control} defaultValue={contact?.emailAddress || ''}
                            type='email' label={t('contacts.contact-details.individual.email')} dataTestId='contact-email' />
                    </div>
                    <div className={`col-span-12 lg:col-span-${!isCompanyContact ? '3' : '5'}`}>
                        <ControlledInput name='workMainPhone' control={control}
                            defaultValue={contact?.workMainPhone || ''} label={t('contacts.contact-details.individual.work_main_phone')}
                            type='tel' mask={mask} dataTestId='contact-work-main-phone' />
                    </div>
                    {
                        !isCompanyContact &&
                        <div className="col-span-12 lg:col-span-2">
                            <ControlledInput name='workMainExtension' type='number' control={control}
                                defaultValue={contact?.workMainExtension || ''} label={t('contacts.contact-details.individual.extension')}
                                dataTestId='contact-work-main-extension' />
                        </div>
                    }
                    {
                        !isCompanyContact &&
                        <>
                            <div className="col-span-12 lg:col-span-5">
                                <ControlledInput name='workDirectPhone' control={control}
                                    defaultValue={contact?.workDirectPhone || ''} label={t('contacts.contact-details.individual.work_direct_phone')}
                                    type='tel' mask={mask} dataTestId='contact-work_direct_phone' />
                            </div>
                            <div className="col-span-12 lg:col-span-5">
                                <ControlledInput name='mobile' control={control}
                                    defaultValue={contact?.mobilePhone || ''} label={t('contacts.contact-details.individual.mobile')}
                                    type='tel' mask={mask} dataTestId='contact-mobile' />
                            </div>
                        </>
                    }
                    <div className="col-span-12 lg:col-span-5">
                        <ControlledInput type='tel' name='fax' control={control}
                            defaultValue={contact?.fax || ''} label={t('contacts.contact-details.individual.fax')} mask={mask}
                            dataTestId='contact-fax' />
                    </div>
                    <div className="col-span-12 lg:col-span-5">
                        <ControlledInput name='website' control={control}
                            defaultValue={contact?.website || ''} label={t('contacts.contact-details.individual.website')}
                            dataTestId='contact-website' />
                    </div>
                </div>
                <ContactAddress defaultValue={defaultPrimaryAddress}
                    title={t('contacts.contact-details.individual.address')}
                    control={control}
                    addressType={AddressType.PrimaryAddress} />
                {
                    showAddressSection(shippingAddressOption.value) && (
                        <ContactAddress title={t(SHIPPING_ADDRESS_LABEL_KEY)}
                            addressType={AddressType.ShippingAddress} control={control}
                            removeCTAClickHandler={() => handleRemoveCTABtnClick(shippingAddressOption)}
                            defaultValue={defaultShippingAddress} />
                    )
                }
                {
                    showAddressSection(billingAddressOption.value) && (
                        <ContactAddress title={t(BILLING_ADDRESS_LABEL_KEY)}
                            addressType={AddressType.BillingAddress} control={control}
                            removeCTAClickHandler={() => handleRemoveCTABtnClick(billingAddressOption)}
                            defaultValue={defaultBillingAddress} />
                    )
                }
                <ContactAddressPicker options={addressDropdownOptions} onSelect={handleAddressPickerChange} />
                <div className="flex justify-center items-center full-w h-20 mb-4">
                    <Button type='submit' buttonType='medium' label={t('common.save')} className='mr-8' disabled={!isValid} />
                    <Button buttonType='secondary' label={t('common.cancel')} className='h-10 secondary-contact-form-btn' onClick={closeButtonHandler} />
                </div>
            </form>
        </div>)
}

export default ContactForm;
