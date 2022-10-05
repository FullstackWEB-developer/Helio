import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RemoveCTA from '@components/remove-cta/remove-cta';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {Control} from 'react-hook-form';
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
    control: Control
    defaultValue?: Address
}
const ContactAddress = ({title, addressType, control, removeCTAClickHandler}: ContactAddressProps) => {
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
    

    const onAsPrimaryCheckChange = (event: CheckboxCheckEvent) => {
        setDisabledField(event.checked);
        const prefix = determineFormNamePrefix();
        if (!event.checked) {
            control.setValue(`${prefix}AddressLine`, '', {
                shouldValidate: true,
                shouldDirty: true
            });
            control.setValue(`${prefix}Apt`, '');
            control.setValue(`${prefix}City`, '');
            control.setValue(`${prefix}State`, '');
            control.setValue(`${prefix}ZipCode`, '');
        } else {
            const primaryName = 'primary';
            control.setValue(`${prefix}AddressLine`, control.getValues(`${primaryName}AddressLine`), {
                shouldValidate: true,
                shouldDirty: true
            });
            control.setValue(`${prefix}Apt`, control.getValues(`${primaryName}Apt`));
            control.setValue(`${prefix}City`, control.getValues(`${primaryName}City`));
            control.setValue(`${prefix}State`, control.getValues(`${primaryName}State`));
            control.setValue(`${prefix}ZipCode`, control.getValues(`${primaryName}ZipCode`));
        }
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
                            <div className="col-span-12 lg:col-span-3"/>
                            <div className="col-span-12 lg:col-span-2">
                                <RemoveCTA onClick={removeCTAClickHandler} />
                            </div>
                        </div>
                    )
            }
            {
                !primaryAddress &&
                <div className="relative">
                    <Checkbox name='' label={t('contacts.contact_details.individual.same_as_primary')} onChange={onAsPrimaryCheckChange} />
                </div>
            }
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}AddressLine`}
                        control={control}
                        defaultValue=''
                        disabled={disabledFields}
                        label={t('contacts.contact_details.individual.address')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-line`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}Apt`}
                        control={control}
                        defaultValue=''
                        disabled={disabledFields}
                        label={t('contacts.contact_details.individual.apt')}
                        dataTestId={`contact${determineFormNamePrefix()}-address-apt`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}City`}
                        control={control}
                        disabled={disabledFields}
                        defaultValue=''
                        label={t('contacts.contact_details.individual.city')}
                        dataTestId={`contact-${determineFormNamePrefix()}-address-city`}
                    />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <ControlledSelect
                        name={`${determineFormNamePrefix()}State`}
                        disabled={disabledFields}
                        defaultValue=''
                        control={control}
                        label={t('contacts.contact_details.individual.state')}
                        options={options}
                        autoComplete={false}
                        allowClear={true}
                    />
                </div>
                <div className="col-span-12 lg:col-span-2">
                    <ControlledInput
                        name={`${determineFormNamePrefix()}ZipCode`}
                        pattern={{
                            value: /^[+ 0-9]{5}$/,
                            message: t('contacts.contact_details.individual.zip_code_validation')
                        }}
                        maxLength={5}
                        disabled={disabledFields}
                        control={control}
                        defaultValue=''
                        label={t('contacts.contact_details.individual.zip_code')} dataTestId={`contact-${determineFormNamePrefix()}-zip-code`} />
                </div>
            </div>
        </>
    )
}

export default ContactAddress;
