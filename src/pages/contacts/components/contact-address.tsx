import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RemoveCTA from '@components/remove-cta/remove-cta';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {Control, FieldValues} from 'react-hook-form';
import ControlledInput from '@components/controllers/ControlledInput';
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
    const [disabledFields, setDisabledField] = useState(false);

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

    const onAsPrimaryCheckChange = (event: CheckboxCheckEvent) => {
        setDisabledField(event.checked);
        if (!event.checked) {
            return;
        }
        const primaryName = 'primary';
        control.setValue(`${determineFormNamePrefix()}AddressLine`, control.getValues(`${primaryName}AddressLine`));
        control.setValue(`${determineFormNamePrefix()}Apt`, control.getValues(`${primaryName}Apt`));
        control.setValue(`${determineFormNamePrefix()}City`, control.getValues(`${primaryName}City`));
        control.setValue(`${determineFormNamePrefix()}State`, control.getValues(`${primaryName}State`));
        control.setValue(`${determineFormNamePrefix()}ZipCode`, control.getValues(`${primaryName}ZipCode`));
    }

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
                    <Checkbox name='' label={t('contacts.contact-details.individual.same_as_primary')} onChange={onAsPrimaryCheckChange} />
                </div>
            }
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}AddressLine`}
                        control={control}
                        disabled={disabledFields}
                        defaultValue={defaultValue?.line || ''}
                        label={t('contacts.contact-details.individual.address')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-line`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}Apt`}
                        control={control}
                        disabled={disabledFields}
                        defaultValue={defaultValue?.apartmentNumber || ''}
                        label={t('contacts.contact-details.individual.apt')}
                        dataTestId={`contact${determineFormNamePrefix()}-address-apt`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}City`}
                        control={control}
                        disabled={disabledFields}
                        defaultValue={defaultValue?.city || ''}
                        label={t('contacts.contact-details.individual.city')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-city`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <ControlledSelect
                        name={`${determineFormNamePrefix()}State`}
                        defaultValue={defaultStateOption}
                        disabled={disabledFields}
                        control={control}
                        label={t('contacts.contact-details.individual.state')}
                        options={options}
                        autoComplete={false}
                    />
                </div>
                <div className="col-span-12 lg:col-span-2">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}ZipCode`}
                        disabled={disabledFields}
                        control={control}
                        defaultValue={defaultValue?.zipCode || ''}
                        label={t('contacts.contact-details.individual.zip_code')} dataTestId={`contact-${determineFormNamePrefix()}-zip-code`} />
                </div>
            </div>
        </>
    )
}

export default ContactAddress;
