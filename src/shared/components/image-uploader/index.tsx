import React, {useRef, useState} from 'react';
import Button from '@components/button/button';
import {useTranslation} from 'react-i18next';
import './image-uploader.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import {RegistrationImageType} from '@pages/external-access/models/registration-image-type.enum';
interface ImageUploaderProps {
    title: string;
    buttonText?: string;
    uploadedImage: (image: File | undefined, type: RegistrationImageType) => void,
    maxFileSizeInMegabytes?: number,
    imageType: RegistrationImageType
}
const ImageUploader = ({title, buttonText = 'common.choose_file', uploadedImage, maxFileSizeInMegabytes = 5.0, imageType}: ImageUploaderProps) => {

    const {t} = useTranslation();
    const [image, setImage] = useState<File>();
    const fileInputField = useRef<HTMLInputElement>(null);
    const [sizeError, setSizeError] = useState(false);

    const handleUploadBClick = () => {
        fileInputField?.current?.click();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (files && files.length > 0) {
            if (((files[0].size / 1024) / 1024) < maxFileSizeInMegabytes) {
                setSizeError(false);
                setImage(files[0]);
                uploadedImage(files[0], imageType);
            }
            else {
                setSizeError(true);
            }
        }
    }

    const clearUpload = () => {
        setImage(undefined);
        uploadedImage(undefined, imageType);
    }

    return (
        <div className='flex flex-col pb-6'>
            <div className='pb-5'>{t(title)}</div>
            {
                image ?
                    <div className='flex flex-col'>
                        <div className='flex items-center'>
                            <img
                                className='image-preview-pane'
                                src={URL.createObjectURL(image)}
                                alt={`upload-preview-${image.name}`}
                            />
                            <div className='pl-5'>
                                <SvgIcon type={Icon.Close} fillClass='clear-icon-fill' className='cursor-pointer' onClick={clearUpload} />
                            </div>
                        </div>
                        <div className='pt-3 body3'>{image?.name || ''}</div>
                    </div>
                    :
                    <>
                        <input type='file' ref={fileInputField} title="" value="" multiple={false} accept='.jpg, .jpeg' style={{display: 'none'}}
                            onChange={handleUpload} />
                        <Button label={t(buttonText)} className='mt-5 mb-11 w-44' buttonType='secondary-big'
                            onClick={handleUploadBClick} />
                        {
                            sizeError && <div className='body-3 text-danger'>
                                {
                                    t('common.file_too_large', {'size': maxFileSizeInMegabytes})
                                }
                            </div>
                        }
                    </>
            }
        </div>
    );
}

export default ImageUploader;