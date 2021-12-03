import Radio from "@components/radio/radio";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Option} from '@components/option/option';
import {ControlledDateInput, ControlledInput, ControlledSelect} from "@components/controllers";
import {useDispatch, useSelector} from "react-redux";
import {selectLookupValues} from "@pages/tickets/store/tickets.selectors";
import {selectRegisteredPatient} from '@pages/external-access/registration/store/registration.selectors';
import dayjs from 'dayjs';
import {useForm} from 'react-hook-form';
import Button from '@components/button/button';
import {CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
import {
    setRegisteredPatient,
    setRegisteredPatientInsurance
} from '@pages/external-access/registration/store/registration.slice';
import {useMutation} from 'react-query';
import {upsertPatient} from '@pages/patients/services/patients.service';
interface InsuranceInformationRegistrationStepProps {
    goBack:() => void;
    onPatientUpdate:() => void;
}

export const INSURANCE_PLAN = 'insurance_plan';
export const SELF_PAY = 'self_pay';
const InsuranceInformationRegistrationStep = ({goBack, onPatientUpdate}: InsuranceInformationRegistrationStepProps) => {
    const patientData = useSelector(selectRegisteredPatient);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {control, formState: {isValid, isDirty}, handleSubmit, getValues, setValue} = useForm({mode: 'onChange'});

    const insuranceOptions: Option[] = [
        {
            value: INSURANCE_PLAN,
            label: 'external_access.registration.insurance_plan'
        },
        {
            value: SELF_PAY,
            label: 'external_access.registration.self_pay'
        }
    ];
    const [insuranceOption, setInsuranceOption] = useState<Option | undefined>(insuranceOptions[0]);

    const buildInsuranceNoteText = (): string => {
        let note = ``;
        note += `Insurance Product Type: ${getValues('insuranceType')}\n`;
        note += `Insurance Name: ${getValues('insuranceName')}\n`;
        note += `Subscriber name: ${getValues('policyHolderName')}\n`;
        note += `Insurance member ID: ${getValues('insuranceMemberId')}\n`;
        note += `Policy holder date of birth: ${dayjs(getValues('policyHolderDob')).format('MM/DD/YYYY')}\n`;
        note += `Insurance card group number: ${getValues('groupNumber')}\n`;
        note += `Relationship to policy holder: ${getValues('insuranceRelation')}\n`;
        note += 'Please take a look at the admin document to see the insurance card.';
        return note;
    }

    const updatePatientMutation = useMutation(upsertPatient);
    const onSubmit = () => {
        if (!patientData) {
            return;
        }
        const createPatientRequest: CreatePatientRequest = {
            patient: {
                ...patientData.patient,
            },
            registrationSessionKey: patientData.registrationSessionKey,
            ...(insuranceOption?.value === INSURANCE_PLAN && {insuranceNote:  {noteText: buildInsuranceNoteText(), departmentId: patientData.patient.departmentId}})
        }
        updatePatientMutation.mutate(createPatientRequest, {
            onSuccess: () => {
                onPatientUpdate();
                dispatch(setRegisteredPatient(createPatientRequest));
                dispatch(setRegisteredPatientInsurance({
                    insuranceType: getValues('insuranceType'),
                    insuranceMemberId: getValues('insuranceMemberId'),
                    insuranceName: getValues('insuranceName'),
                    insuranceRelation: getValues('insuranceRelation'),
                    groupNumber: getValues('groupNumber:'),
                    policyHolderDob: dayjs(getValues('policyHolderDob')).toDate(),
                    policyHolderName: getValues('policyHolderName'),
                    insuranceOption: insuranceOption
                }))
            }
        });
    }


    const setSelfValues = (option: Option | undefined) => {
        if (option?.value === 'Self') {
            if (!getValues('policyHolderName') && !!patientData?.patient) {
                setValue('policyHolderName', `${patientData.patient.firstName} ${patientData.patient.lastName}`, {shouldValidate: true});
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
    });
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                insuranceOption?.value === INSURANCE_PLAN &&
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
                            required={insuranceOption?.value === INSURANCE_PLAN}
                            containerClassName='md:w-1/2'
                            defaultValue=''
                            label='external_access.registration.insurance_name'
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledInput
                            control={control}
                            name='policyHolderName'
                            required={insuranceOption?.value === INSURANCE_PLAN}
                            containerClassName='md:w-1/2'
                            defaultValue=''
                            label='external_access.registration.policy_holder_name'
                        />
                        <ControlledDateInput
                            type='date'
                            longDateFormat={false}
                            isCalendarDisabled
                            required={insuranceOption?.value === INSURANCE_PLAN}
                            label='external_access.registration.policy_holder_dob'
                            control={control}
                            name='policyHolderDob'
                            className='md:w-1/2'
                            max={new Date(new Date().toDateString())}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:gap-8'>
                        <ControlledSelect
                            required={insuranceOption?.value === INSURANCE_PLAN}
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
                            required={insuranceOption?.value === INSURANCE_PLAN}
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
            <div className='flex pt-6'>
                <Button label='common.back' buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack()} />
                <Button type='submit' label='common.continue'
                        isLoading={updatePatientMutation.isLoading}
                        disabled={!isValid || (insuranceOption?.value === INSURANCE_PLAN && !isDirty)} className='w-36' />
            </div>
        </form>
    );
}

export default InsuranceInformationRegistrationStep;
