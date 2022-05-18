import ImageUploader from '@components/image-uploader';
import {RegistrationImageType} from '@pages/external-access/models/registration-image-type.enum';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectRegisteredPatient,
    selectRegisteredPatientInsurance
} from '@pages/external-access/registration/store/registration.selectors';
import {useMutation} from 'react-query';
import {uploadPatientRegistrationImages} from '@pages/patients/services/patient-document.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {
    INSURANCE_PLAN
} from '@pages/external-access/registration/components/registration-insurance-information';
import Button from '@components/button/button';
import {setRegisteredPatient} from '../store/registration.slice';

interface UploadDocumentsRegistrationStepProps {
    goStepForward: () => void;
    goBack: () => void
}
const UploadDocumentsRegistrationStep = ({goStepForward, goBack}: UploadDocumentsRegistrationStepProps) => {
    const dispatch = useDispatch();
    const patientData = useSelector(selectRegisteredPatient);
    const insuranceData = useSelector(selectRegisteredPatientInsurance);
    const [driversLicense, setDriversLicense] = useState<File | undefined>();
    const [insuranceCardFront, setInsuranceCardFront] = useState<File | undefined>();
    const [insuranceCardBack, setInsuranceCardBack] = useState<File | undefined>();
    const [advanceNextStep, setAdvanceNextStep] = useState(false);
    useEffect(() => {
        if (patientData?.imageUploadTag && advanceNextStep) {
            setAdvanceNextStep(false);
            goStepForward();
        }
    }, [goStepForward, patientData?.imageUploadTag, advanceNextStep]);

    const insuranceDocumentUploadRequired = useMemo(() => {
        return insuranceData?.insuranceOption?.value === INSURANCE_PLAN
    }, [insuranceData]);

    const uploadDocuments = () => {
        const triggerUploadValidity = insuranceDocumentUploadRequired ? !!driversLicense && !!insuranceCardFront && !!insuranceCardBack : !!driversLicense;
        if (triggerUploadValidity) {
            uploadDocumentsMutation.mutate({driversLicenseImage: driversLicense!, insuranceFrontImage: insuranceCardFront, insuranceBackImage: insuranceCardBack});
        }
    }

    useEffect(() => {
        if (!insuranceDocumentUploadRequired) {
            if (!!insuranceCardFront) {
                setInsuranceCardFront(undefined);
            }
            if (!!insuranceCardBack) {
                setInsuranceCardBack(undefined);
            }
        }
        if (patientData) {
            dispatch(setRegisteredPatient({...patientData, imageUploadTag: ''}));
        }
    }, [insuranceCardBack, insuranceCardFront, insuranceDocumentUploadRequired]);

    const uploadDocumentsMutation = useMutation(uploadPatientRegistrationImages, {
        onSuccess: (data) => {
            if (patientData) {
                setAdvanceNextStep(true);
                dispatch(setRegisteredPatient({...patientData, imageUploadTag: data.fileTag}));
            }
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
            if (patientData) {
                dispatch(setRegisteredPatient({...patientData, imageUploadTag: ''}))
            }
        }
    }

    const uploadButtonEnabled = () => {
        const sharedConditions = !!driversLicense && !uploadDocumentsMutation.isLoading;
        if (insuranceDocumentUploadRequired) {
            return sharedConditions && !!insuranceCardFront && !!insuranceCardBack;
        }
        return sharedConditions;
    }

    return (
        <div className='flex flex-col'>
            <ImageUploader title='external_access.registration.drivers_license'
                uploadedImage={handleImageUpload} imageType={RegistrationImageType.DriversLicense} required={true} />
            {
                insuranceDocumentUploadRequired &&
                <>
                    <ImageUploader title='external_access.registration.insurance_card_front'
                        uploadedImage={handleImageUpload} imageType={RegistrationImageType.InsuranceCardFrontSide} required={true} />
                    <ImageUploader title='external_access.registration.insurance_card_back'
                        uploadedImage={handleImageUpload} imageType={RegistrationImageType.InsuranceCardBackSide} required={true} />
                </>
            }
            {
                <div className='flex pt-6'>
                    <Button label='common.back' buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack()} />
                    {!patientData?.imageUploadTag && <Button label='common.upload' buttonType='big'
                        isLoading={uploadDocumentsMutation.isLoading}
                        disabled={!uploadButtonEnabled()}
                        onClick={uploadDocuments} />}
                </div>
            }
        </div>
    );
}

export default UploadDocumentsRegistrationStep;
