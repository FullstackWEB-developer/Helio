import React, { useEffect, useRef, useState } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import './simple-image-uploader.scss';
import SvgIcon, { Icon } from '@components/svg-icon';
import classNames from 'classnames';
import utils from '@shared/utils/utils';
interface ImageUploaderProps {
    src: string | undefined,
    initialSrc: string | undefined,
    buttonText?: string,
    uploadedImage: (image: File | undefined) => void,
    onClearImage: () => void,
    maxFileSizeInMegabytes?: number
}
const SimpleImageUploader = ({
    src,
    initialSrc,
    buttonText = 'common.choose_file',
    uploadedImage,
    onClearImage,
    maxFileSizeInMegabytes = 5.0 }: ImageUploaderProps) => {

    const { t } = useTranslation();
    const imageBaseUrl = utils.getAppParameter('AssetsPath');
    const [imageSrc, setImageSrc] = useState<File | string | undefined>(src);
    const [imageName, setImageName] = useState<string | undefined>();
    const fileInputField = useRef<HTMLInputElement>(null);
    const [sizeError, setSizeError] = useState(false);

    const handleUploadBClick = () => {
        fileInputField?.current?.click();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            if (((files[0].size / 1024) / 1024) < maxFileSizeInMegabytes) {
                setSizeError(false);
                setImageSrc(files[0]);
                uploadedImage(files[0]);
            }
            else {
                setSizeError(true);
            }
        }
    }

    const clearUpload = () => {
        setImageSrc(initialSrc);
        uploadedImage(undefined);
        onClearImage();
    }
    useEffect(() => {
        if (imageSrc) {
            if (typeof imageSrc === 'string') {
                setImageName(imageSrc.substring(imageSrc.lastIndexOf("/") + 1));
            } else {
                setImageName(imageSrc.name);
            }
        }
    }, [imageSrc]);

    return (
        <div className='flex flex-row items-center'>
            <div>
                <Button label={t(buttonText)}
                    buttonType='secondary-big'
                    onClick={handleUploadBClick} />
            </div>
            {
                sizeError && <div className='body-3 text-danger'>
                    {
                        t('common.file_too_large', { 'size': maxFileSizeInMegabytes })
                    }
                </div>
            }
            {imageSrc &&
                <div className='flex flex-col ml-6'>
                    <div className='flex items-center'>

                        <img
                            className='image-preview-pane'
                            src={typeof imageSrc === 'string' ? `${imageBaseUrl}${imageSrc}` : URL.createObjectURL(imageSrc)}
                            alt={`upload-preview-${imageName}`}
                        />
                        <div className={classNames('pl-5')}>
                            <SvgIcon type={Icon.Close}
                                fillClass='clear-icon-fill'
                                className='cursor-pointer'
                                onClick={clearUpload}
                                disabled={src == initialSrc} />
                        </div>

                    </div>
                    <div className='pt-3 body3'>{imageName}</div>
                </div>
            }
            <input type='file' ref={fileInputField} title="" value="" multiple={false} accept='.jpg, .jpeg, .png' style={{ display: 'none' }}
                onChange={handleUpload} />

        </ div>
    );
}

export default SimpleImageUploader;