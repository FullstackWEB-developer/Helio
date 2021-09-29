import ImageUploader from '@components/image-uploader';
import {RegistrationImageType} from '@pages/external-access/models/registration-image-type.enum';
import React from 'react';

interface UploadDocumentsRegistrationStepProps {
    handleDriversLicenseUpload: (image: File | undefined, type: RegistrationImageType) => void,
    handleInsuranceCardFrontUpload: (image: File | undefined, type: RegistrationImageType) => void,
    handleInsuranceBackCardUpload: (image: File | undefined, type: RegistrationImageType) => void
}
const UploadDocumentsRegistrationStep = ({
    handleDriversLicenseUpload,
    handleInsuranceCardFrontUpload,
    handleInsuranceBackCardUpload
}: UploadDocumentsRegistrationStepProps) => {

    return (
        <div className='flex flex-col'>
            <ImageUploader title='external_access.registration.drivers_license'
                uploadedImage={handleDriversLicenseUpload} imageType={RegistrationImageType.DriversLicense} required={true}/>
            <ImageUploader title='external_access.registration.insurance_card_front'
                uploadedImage={handleInsuranceCardFrontUpload} imageType={RegistrationImageType.InsuranceCardFrontSide} required={true} />
            <ImageUploader title='external_access.registration.insurance_card_back'
                uploadedImage={handleInsuranceBackCardUpload} imageType={RegistrationImageType.InsuranceCardBackSide} required={true} />
        </div>
    );
}

export default UploadDocumentsRegistrationStep;