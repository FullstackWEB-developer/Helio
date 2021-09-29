import Button from '@components/button/button';
import {RegistrationStep} from '@pages/external-access/models/registration-step.enum';
import utils from '@shared/utils/utils';
import React, {useEffect, useState} from 'react';
import {Option} from '@components/option/option';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import PersonalInformationRegistrationStep from './registration-personal-info';
import CommunicationPreferencesRegistrationStep from './registration-communication-preferences';
import InsuranceInformationRegistrationStep from './registration-insurance-information';
import UploadDocumentsRegistrationStep from './registration-documents';
import RegistrationReviewStep from './registration-review';
import {useMutation} from 'react-query';
import {uploadPatientRegistrationImages} from '@pages/patients/services/patient-document.service';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {createPatient} from '@pages/patients/services/patients.service';
import {CreatePatientModel, CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
import {RegistrationImageType} from '@pages/external-access/models/registration-image-type.enum';
import dayjs from 'dayjs';
import {setRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {RequestChannel} from '@pages/external-access/verify-patient/models/request-channel.enum';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {useHistory} from 'react-router';


const RegistrationForm = ({step, goStepForward, goBack}: {step: RegistrationStep, goStepForward: (uploadingDocumentsRequired: boolean) => void, goBack: (uploadingDocumentsRequired: boolean) => void}) => {
    const {control, formState: {isValid, errors}, handleSubmit, watch, setError, getValues, setValue} = useForm({mode: 'onChange'});
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const onSubmit = (formData: any) => {
        const departmentId = Number(utils.getAppParameter('DefaultDepartmentId')) ?? 3;
        const patient: CreatePatientModel = {
            address: formData.address,
            city: formData.city,
            consentToCall: utils.isString(formData.callConsent) ? formData.callConsent === 'true' : formData.callConsent.value === 'true',
            consentToText: utils.isString(formData.textConsent) ? formData.textConsent === 'true' : formData.textConsent.value === 'true',
            departmentId,
            dateOfBirth: dayjs(formData.dob).format('MM/DD/YYYY'),
            ...(formData.email && {email: formData.email}),
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobilePhone: formData.mobilePhone,
            sex: utils.isString(formData.gender) ? formData.gender.charAt(0) : formData.gender.value.charAt(0),
            zip: formData.zip,
            referralSourceId: formData.referralSource,
            contactPreference: formData.preferredCommunication,
        }
        const createPatientRequest: CreatePatientRequest = {
            patient,
            ...(uploadDocumentsRequired && {insuranceNote: {noteText: buildInsuranceNoteText(), departmentId}}),
            ...(uploadDocumentsRequired && {imageUploadTag})
        }
        createPatientMutation.mutate(createPatientRequest);
    }

    const dobValue = watch('dob', '');
    if (utils.isMinor(dobValue) && !errors.dob) {
        setError('dob', {type: 'min', message: 'external_access.registration.minor_dob'});
    }

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
    const [insuranceOption, setInsuranceOption] = useState<Option | undefined>(insuranceOptions[0]);
    const [driversLicense, setDriversLicense] = useState<File | undefined>();
    const [insuranceCardFront, setInsuranceCardFront] = useState<File | undefined>();
    const [insuranceCardBack, setInsuranceCardBack] = useState<File | undefined>();

    const handleImageUpload = (image: File | undefined, type: RegistrationImageType) => {
        switch (type) {
            case RegistrationImageType.DriversLicense:
                setDriversLicense(image);
                break;
            case RegistrationImageType.InsuranceCardFrontSide:
                setInsuranceCardFront(image);
                break;
            case RegistrationImageType.InsuranceCardBackSide:
                setInsuranceCardBack(image);
                break;
        }
        if (!image) {
            setImageUploadTag('');
        }
    }

    const toastMessageDuration = 12;
    const [newlyCreatedPatientId, setNewlyCreatedPatientId] = useState<string>('');
    const createPatientMutation = useMutation(createPatient, {
        onSuccess: (data) => {
            setNewlyCreatedPatientId(data.patientId);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'external_access.registration.patient_creation_success',
                durationInSeconds: toastMessageDuration
            }));

            const redirectLink: RedirectLink = {
                requestChannel: RequestChannel.Web,
                patientId: data.patientId,
                requestType: ExternalAccessRequestTypes.ScheduleAppointment,
                linkCreationDate: new Date(),
                fullUrl: '',
                linkId: '/o/schedule-appointment',
                attributes: [],
                sentAddress: getValues('mobilePhone'),
                ticketId: ''
            }
            setTimeout(() => {
                dispatch(setRedirectLink(redirectLink));
                history.replace('/o/verify-patient-get-mobile');
            }, toastMessageDuration * 1000);
        },
        onError: (error: any) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: error?.response?.data.message ?? 'external_access.registration.patient_creation_failure'
            }));
        }
    });

    const [imageUploadTag, setImageUploadTag] = useState<string>('');
    const uploadDocumentsMutation = useMutation(uploadPatientRegistrationImages, {
        onSuccess: (data) => {
            setImageUploadTag(data.fileTag);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'external_access.registration.images_upload_success'
            }));
        },
        onError: (error: any) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: error?.response?.data.message ?? 'external_access.registration.image_upload_failed'
            }));
        }

    });

    useEffect(() => {
        if (imageUploadTag) {
            goStepForward(uploadDocumentsRequired);
        }
    }, [imageUploadTag]);

    const uploadDocuments = () => {
        if (driversLicense && insuranceCardFront && insuranceCardBack) {
            uploadDocumentsMutation.mutate({driversLicenseImage: driversLicense, insuranceFrontImage: insuranceCardFront, insuranceBackImage: insuranceCardBack});
        }
    }

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

    const uploadDocumentsRequired = insuranceOption?.value === 'insurance_plan';

    const continueButtonEnabled = () => {
        switch (step) {
            case RegistrationStep.PersonalInformation:
                return getValues('firstName') && getValues('lastName') && getValues('dob') && getValues('mobilePhone')
                    && getValues('zip') && getValues('address') && getValues('city') && getValues('referralSource') 
                    && !errors.dob && !errors.email && !errors.zip && !errors.mobilePhone;
            case RegistrationStep.CommunicationPreferences:
                return !!getValues('preferredCommunication');
            case RegistrationStep.InsuranceInformation:
                return uploadDocumentsRequired ? getValues('insuranceType') && getValues('insuranceName')
                    && getValues('policyHolderName') && getValues('policyHolderDob') && getValues('insuranceRelation')
                    && getValues('insuranceMemberId') && !errors.policyHolderDob : true;
            case RegistrationStep.Documents:
                return imageUploadTag !== '';
        }
    }

    const getDisplayClass = (currentStep: RegistrationStep) => {
        return currentStep === step ? 'block' : 'hidden';
    }

    return (
        <>
            {
                errors?.dob?.type === 'min' && <div className='pt-5 body2 text-danger'>{t('external_access.registration.minor_dob_detail',
                    {number: utils.getAppParameter('CallUsPhone')})}</div>
            }
            <div className='py-10 w-full'>

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full md:w-2/3'>

                    <div className={getDisplayClass(RegistrationStep.PersonalInformation)}>
                        <PersonalInformationRegistrationStep control={control} errors={errors} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.CommunicationPreferences)}>
                        <CommunicationPreferencesRegistrationStep control={control} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.InsuranceInformation)}>
                        <InsuranceInformationRegistrationStep control={control} insuranceOption={insuranceOption} setInsuranceOption={setInsuranceOption}
                            getValues={getValues} setValue={setValue} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.Documents)}>
                        <UploadDocumentsRegistrationStep
                            handleDriversLicenseUpload={handleImageUpload}
                            handleInsuranceBackCardUpload={handleImageUpload}
                            handleInsuranceCardFrontUpload={handleImageUpload} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.Review)}>
                        <RegistrationReviewStep getValues={getValues} insuranceOption={insuranceOption} />
                    </div>

                    {
                        !newlyCreatedPatientId && <div className='flex pt-6'>
                            {step > RegistrationStep.PersonalInformation && <Button label='common.back' buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack(uploadDocumentsRequired)} />}
                            {(step < RegistrationStep.Documents || (step === RegistrationStep.Documents && imageUploadTag)) &&
                                <Button label='common.continue' buttonType='big' className='mr-8 w-36'
                                    disabled={!continueButtonEnabled()} onClick={() => goStepForward(uploadDocumentsRequired)} />}
                            {
                                step === RegistrationStep.Documents && !imageUploadTag &&
                                <Button label='common.upload' buttonType='big'
                                    isLoading={uploadDocumentsMutation.isLoading}
                                    disabled={!driversLicense || !insuranceCardFront || !insuranceCardBack || uploadDocumentsMutation.isLoading}
                                    onClick={uploadDocuments} />
                            }
                            {
                                step === RegistrationStep.Review &&
                                <Button type='submit' label='common.submit'
                                    disabled={!isValid || createPatientMutation.isLoading}
                                    isLoading={createPatientMutation.isLoading} className='w-36' />
                            }
                        </div>
                    }
                </form>
            </div>
        </>
    )
}

export default RegistrationForm;