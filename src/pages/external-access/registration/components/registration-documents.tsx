import ImageUploader from '@components/image-uploader';
import {RegistrationImageType} from '@pages/external-access/models/registration-image-type.enum';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectRegisteredPatient,
    selectRegisteredPatientInsurance
} from '@pages/external-access/registration/store/registration.selectors';
import {useMutation} from 'react-query';
import {uploadPatientRegistrationImage} from '@pages/patients/services/patient-document.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {
    INSURANCE_PLAN
} from '@pages/external-access/registration/components/registration-insurance-information';
import Button from '@components/button/button';
import {setRegisteredPatient} from '../store/registration.slice';
import {v4 as uuidv4} from 'uuid';
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

    const uploadDocuments = async () => {
        const triggerUploadValidity = insuranceDocumentUploadRequired ? !!driversLicense && !!insuranceCardFront && !!insuranceCardBack : !!driversLicense;
        if (triggerUploadValidity) {
            try {
                var imageUploadTag = uuidv4();
                var driversLicenseUploadTask = uploadDriverLicenseMutation.mutateAsync({file: driversLicense!, imageUploadTag, label: "DriversLicense"});
                var insuranceCardFrontUploadTask;
                var insuranceCardBackUploadTask;
                if (insuranceDocumentUploadRequired && insuranceCardFront) {
                    insuranceCardFrontUploadTask = uploadInsuranceCardFrontMutation.mutateAsync({file: insuranceCardFront, imageUploadTag, label: "InsuranceCardFront"});
                }
                if (insuranceDocumentUploadRequired && insuranceCardBack) {
                    insuranceCardBackUploadTask = uploadInsuranceCardBackMutation.mutateAsync({file: insuranceCardBack, imageUploadTag, label: "InsuranceCardBack"});
                }
                const response = await driversLicenseUploadTask;
                if (insuranceCardFrontUploadTask) {
                    await insuranceCardFrontUploadTask;
                }
                if (insuranceCardBackUploadTask) {
                    await insuranceCardBackUploadTask;
                }
                if (patientData) {
                    dispatch(setRegisteredPatient({...patientData, imageUploadTag: response.fileTag}));
                    setAdvanceNextStep(true);
                }
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: 'external_access.registration.images_upload_success'
                }));
            }
            catch (error: any) {
                uploadDriverLicenseMutation.reset()
                uploadInsuranceCardFrontMutation.reset();
                uploadInsuranceCardBackMutation.reset();
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: error?.response?.data.message ?? 'external_access.registration.image_upload_failed'
                }));
            }
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

    const uploadDriverLicenseMutation = useMutation(uploadPatientRegistrationImage, {});
    const uploadInsuranceCardFrontMutation = useMutation(uploadPatientRegistrationImage);
    const uploadInsuranceCardBackMutation = useMutation(uploadPatientRegistrationImage);
    const uploadingDocuments = uploadDriverLicenseMutation.isLoading || uploadInsuranceCardFrontMutation.isLoading ||
        uploadInsuranceCardBackMutation.isLoading;
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
        const sharedConditions = !!driversLicense && !uploadingDocuments;
        if (insuranceDocumentUploadRequired) {
            return sharedConditions && !!insuranceCardFront && !!insuranceCardBack;
        }
        return sharedConditions;
    }

    return (
        <div className='flex flex-col'>
            <ImageUploader title='external_access.registration.drivers_license'
                uploadedImage={handleImageUpload} imageType={RegistrationImageType.DriversLicense} required={true} disableImageRemoval={uploadingDocuments} />
            {
                insuranceDocumentUploadRequired &&
                <>
                    <ImageUploader title='external_access.registration.insurance_card_front'
                        uploadedImage={handleImageUpload} imageType={RegistrationImageType.InsuranceCardFrontSide} required={true} disableImageRemoval={uploadingDocuments} />
                    <ImageUploader title='external_access.registration.insurance_card_back'
                        uploadedImage={handleImageUpload} imageType={RegistrationImageType.InsuranceCardBackSide} required={true} disableImageRemoval={uploadingDocuments} />
                </>
            }
            {
                <div className='flex pt-6'>
                    <Button label='common.back' disabled={uploadingDocuments} buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack()} />
                    {!patientData?.imageUploadTag && <Button label='common.upload' buttonType='big'
                        isLoading={uploadingDocuments}
                        disabled={!uploadButtonEnabled()}
                        onClick={uploadDocuments} />
                    }
                    {
                        patientData?.imageUploadTag && <Button label='common.continue' buttonType='big' onClick={() => goStepForward()} />
                    }
                </div>
            }
        </div>
    );
}

export default UploadDocumentsRegistrationStep;
