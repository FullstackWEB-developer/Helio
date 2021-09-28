import Radio from "@components/radio/radio";
import React from "react";
import {Control, FieldValues} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Option} from '@components/option/option';
import {ControlledDateInput, ControlledInput, ControlledSelect} from "@components/controllers";
import {useSelector} from "react-redux";
import {selectLookupValues} from "@pages/tickets/store/tickets.selectors";
interface InsuranceInformationRegistrationStepProps {
    control: Control<FieldValues>,
    insuranceOption: Option | undefined,
    setInsuranceOption: (option: Option | undefined) => void,
    getValues: any,
    setValue: any
}
const InsuranceInformationRegistrationStep = ({control, getValues, setValue, insuranceOption, setInsuranceOption}: InsuranceInformationRegistrationStepProps) => {

    const {t} = useTranslation();

    const insuranceOptions: Option[] = [
        {
            value: 'insurance_plan',
            label: 'external_access.registration.insurance_plan'
        },
        {
            value: 'self_pay',
            label: 'external_access.registration.self_pay'
        }
    ];


    const setSelfValues = (option: Option | undefined) => {
        if (option?.value === 'Self') {
            if (!getValues('policyHolderName')) {
                setValue('policyHolderName', `${getValues('firstName')} ${getValues('lastName')}`, {shouldValidate: true});
            }
        }
    }

    const insuranceHolderRelationLookupValues = useSelector((state) => selectLookupValues(state, 'InsuranceHolderRelation'));
    const relationshipToPolicyHolderOptions: Option[] = insuranceHolderRelationLookupValues.map(relationItem => {
        return {
            value: relationItem.label,
            label: `external_access.registration.${relationItem.value}`
        }
    });

    const insuranceTypeLookupValues = useSelector((state) => selectLookupValues(state, 'InsuranceType'));

    const insuranceTypeOptions:  Option[] = insuranceTypeLookupValues.map(typeItem => {
        return {
            value: typeItem.label,
            label: `external_access.registration.${typeItem.value}`
        }
    }) 
    
    return (
        <>
            <div className='flex flex-col'>
                <div>
                    <div className='body2'>
                        {t('common.select_one')}
                    </div>
                    <div className='pt-3'>
                        <Radio
                            defaultValue={insuranceOption?.value}
                            name='insuranceOption'
                            truncate={true}
                            className='flex flex-row space-x-8'
                            items={insuranceOptions}
                            onChange={(value: string) => {setInsuranceOption(insuranceOptions.find(o => o.value === value))}}
                        />
                    </div>
                </div>
            </div>

            {
                insuranceOption?.value === 'insurance_plan' &&
                <>
                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledSelect
                            required={true}
                            name='insuranceType'
                            label='external_access.registration.insurance_type'
                            className='md:w-1/2'
                            options={insuranceTypeOptions}
                            defaultValue=''
                            control={control}
                        />
                        <ControlledInput
                            control={control}
                            name='insuranceName'
                            required={true}
                            containerClassName='md:w-1/2'
                            defaultValue=''
                            label='external_access.registration.insurance_name'
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledInput
                            control={control}
                            name='policyHolderName'
                            required={true}
                            containerClassName='md:w-1/2'
                            defaultValue=''
                            label='external_access.registration.policy_holder_name'
                        />
                        <ControlledDateInput
                            type='date'
                            longDateFormat={false}
                            isCalendarDisabled
                            required={true}
                            label='external_access.registration.policy_holder_dob'
                            control={control}
                            name='policyHolderDob'
                            className='md:w-1/2'
                            max={new Date(new Date().toDateString())}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledSelect
                            required={true}
                            name='insuranceRelation'
                            label='external_access.registration.policy_holder_relationship'
                            className='md:w-1/2'
                            options={relationshipToPolicyHolderOptions}
                            defaultValue=''
                            control={control}
                            onSelect={(option) => setSelfValues(option)} />

                        <ControlledInput
                            control={control}
                            name='insuranceMemberId'
                            required={true}
                            defaultValue=''
                            containerClassName='md:w-1/2'
                            label='external_access.registration.insurance_member_id'
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledInput
                            control={control}
                            name='groupNumber'
                            defaultValue=''
                            required={false}
                            containerClassName='md:w-1/2'
                            label='external_access.registration.group_number'
                        />
                    </div>
                </>
            }
        </>
    );
}

export default InsuranceInformationRegistrationStep;