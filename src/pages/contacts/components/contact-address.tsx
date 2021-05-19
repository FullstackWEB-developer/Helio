import React from 'react';
import Select from '@components/select/select';
import {useTranslation} from 'react-i18next';
import RemoveCTA from '@components/remove-cta/remove-cta';
import Checkbox from '@components/checkbox/checkbox';
import {Control, Controller, FieldValues} from 'react-hook-form';
import ControlledInput from '@components/controllers/ControllerInput';
import {Address, AddressType} from '@shared/models/address.model';
import {useSelector} from 'react-redux';
import {selectStates} from '@shared/store/lookups/lookups.selectors';
import {Option} from '@shared/components/option/option';
import ControlledSelect from '@components/controllers/controlled-select';
interface ContactAddressProps {
    title: string,
    removeCTAClickHandler?: () => void,
    addressType: AddressType
    control: Control<FieldValues>
    defaultValue?: Address
}
const ContactAddress = ({title, addressType, control, removeCTAClickHandler, defaultValue}: ContactAddressProps) => {
    const {t} = useTranslation();
    const primaryAddress = addressType === AddressType.PrimaryAddress;
    const determineFormNamePrefix = () => {
        switch (addressType) {
            case AddressType.ShippingAddress:
                return 'shipping';
            case AddressType.BillingAddress:
                return 'billing';
            case AddressType.PrimaryAddress:
            default:
                return 'primary';
        }
    }
    const states = useSelector(selectStates);
    const getStatesOptions = (): Option[] => {
        return states && states.length > 0 ? [...states] : [];
    }
    const options = getStatesOptions();
    const defaultStateOption = defaultValue ? options.find(o => o.value === defaultValue.state) : '';
    return (
        <>
            {
                primaryAddress ?
                    <div className="h-10 flex items-center mt-4 mb-2">
                        {title}
                    </div> :
                    (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 h-10 mt-2 mb-4 items-center">
                            <div className="col-span-12 lg:col-span-5">
                                {title}
                            </div>
                            <div className="col-span-12 lg:col-span-3"></div>
                            <div className="col-span-12 lg:col-span-2">
                                <RemoveCTA onClick={removeCTAClickHandler} />
                            </div>
                        </div>
                    )
            }
            {
                !primaryAddress &&
                <div className="relative">
                    <Checkbox name='' label={t('contacts.contact-details.individual.same_as_primary')} />
                </div>
            }
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput name={`${determineFormNamePrefix()}AddressLine`} control={control}
                        defaultValue={defaultValue?.line || ''} label={t('contacts.contact-details.individual.address')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-line`} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput name={`${determineFormNamePrefix()}Apt`} control={control}
                        defaultValue={''} label={t('contacts.contact-details.individual.apt')}
                        dataTestId={`contact${determineFormNamePrefix()}-address-apt`} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput name={`${determineFormNamePrefix()}City`} control={control}
                        defaultValue={defaultValue?.city || ''} label={t('contacts.contact-details.individual.city')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-city`} />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <ControlledSelect
                        name={`${determineFormNamePrefix()}State`}
                        defaultValue={defaultStateOption}
                        control={control}
                        label={t('contacts.contact-details.individual.state')}
                        options={options}
                    />
                </div>
                <div className="col-span-12 lg:col-span-2">
                    <ControlledInput name={`${determineFormNamePrefix()}ZipCode`} control={control}
                        defaultValue={defaultValue?.zipCode || ''}
                        label={t('contacts.contact-details.individual.zip_code')} dataTestId={`contact-${determineFormNamePrefix()}-zip-code`} />
                </div>
            </div>
        </>
    )
}

export default ContactAddress;
