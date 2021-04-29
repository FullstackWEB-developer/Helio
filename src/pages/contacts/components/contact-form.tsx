import Button from '@components/button/button';
import Input from '@components/input/input';
import Select from '@components/select/select';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ContactType} from '../models/ContactType';
import ContactAddressPicker from './contact-address-picker';
import {Option} from '@components/option/option';
import ContactAddress from './contact-address';
interface ContactFormProps {
    contactType: ContactType
}
const ContactForm = ({contactType}: ContactFormProps) => {
    const {t} = useTranslation();
    const mask = '(999) 999-9999';
    const isCompanyContact = contactType === ContactType.Company;
    const shippingAddressOption: Option = {label: `${t('contacts.contact-details.individual.shipping_address')}`, value: `${t('contacts.contact-details.individual.shipping_address')}`};
    const billingAddressOption: Option = {label: `${t('contacts.contact-details.individual.billing_address')}`, value: `${t('contacts.contact-details.individual.billing_address')}`};
    const [addressDropdownOptions, setAddressDropdownOptions] = useState<Option[]>([shippingAddressOption, billingAddressOption]);
    const handleAddressPickerChange = (id: string) => {
        setAddressDropdownOptions(addressDropdownOptions.filter(o => o.value !== id));
    }
    const showAddressSection = (value: string) => {
        return !addressDropdownOptions.some(o => o.label === value);
    }
    const handleRemoveCTABtnClick = (value: Option) => {
        setAddressDropdownOptions([...addressDropdownOptions, value]);
    }
    return (
        <div className='flex flex-col'>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                {
                    !isCompanyContact &&
                    (
                        <>
                            <div className="col-span-12 lg:col-span-5">
                                <Input label={t('contacts.contact-details.individual.first_name')} required={true} />
                            </div>
                            <div className="col-span-12 lg:col-span-5">
                                <Input label={t('contacts.contact-details.individual.last_name')} required={true} />
                            </div>
                        </>
                    )
                }
                <div className="col-span-12 lg:col-span-5">
                    <Input label={t('contacts.contact-details.individual.company')} required={isCompanyContact} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Select label={t('contacts.contact-details.individual.category')} options={[]} />
                </div>
                {
                    !isCompanyContact && (
                        <>
                            <div className="col-span-12 lg:col-span-5">
                                <Input label={t('contacts.contact-details.individual.job_title')} />
                            </div>
                            <div className="col-span-12 lg:col-span-5">
                                <Input label={t('contacts.contact-details.individual.department')} />
                            </div>
                        </>
                    )
                }
                <div className="col-span-12 lg:col-span-5">
                    <Input type='email' label={t('contacts.contact-details.individual.email')} />
                </div>
                <div className={`col-span-12 lg:col-span-${!isCompanyContact ? '3' : '5'}`}>
                    <Input type='tel' label={t('contacts.contact-details.individual.work_main_phone')} mask={mask} />
                </div>
                {
                    !isCompanyContact &&
                    <div className="col-span-12 lg:col-span-2">
                        <Input type='number' label={t('contacts.contact-details.individual.extension')} />
                    </div>
                }
                {
                    !isCompanyContact &&
                    <>
                        <div className="col-span-12 lg:col-span-5">
                            <Input type='tel' label={t('contacts.contact-details.individual.work_direct_phone')} mask={mask} />
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <Input type='tel' label={t('contacts.contact-details.individual.mobile')} mask={mask} />
                        </div>
                    </>
                }
                <div className="col-span-12 lg:col-span-5">
                    <Input type='tel' label={t('contacts.contact-details.individual.fax')} mask={mask} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Input label={t('contacts.contact-details.individual.website')} mask={mask} />
                </div>
            </div>
            <ContactAddress title={t('contacts.contact-details.individual.address')} />
            {
                showAddressSection(shippingAddressOption.value) && (
                    <ContactAddress title={t('contacts.contact-details.individual.shipping_address')} optionalAddress={true}
                        removeCTAClickHandler={() => handleRemoveCTABtnClick(shippingAddressOption)} />
                )
            }
            {
                showAddressSection(billingAddressOption.value) && (
                    <ContactAddress title={t('contacts.contact-details.individual.billing_address')} optionalAddress={true}
                        removeCTAClickHandler={() => handleRemoveCTABtnClick(billingAddressOption)} />
                )
            }
            <ContactAddressPicker options={addressDropdownOptions} onSelect={handleAddressPickerChange} />
            <div className="flex justify-center items-center full-w h-20 mb-4">
                <Button type='submit' buttonType='medium' label={t('common.save')} className='mr-8' disabled={true} />
                <Button buttonType='secondary' label={t('common.cancel')} />
            </div>
        </div>
    )
}

export default ContactForm;