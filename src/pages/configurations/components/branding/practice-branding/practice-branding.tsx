import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { useForm } from 'react-hook-form';
import Button from '@components/button/button';
import { GetPracticeBranding } from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import { PracticeBranding } from '@shared/models/practice-branding';
import { getPracticeBranding, savePracticeBranding, uploadAssetFile } from '@shared/services/lookups.service';
import ControlledColorPicker from '@components/controllers/controlled-color-picker/controlled-color-picker';
import './practice-branding.scss'
import SimpleImageUploader from '@components/simple-image-uploader/simple-image-uploader';
import { useState } from 'react';
import {
    getPracticeEmailTemplatePreviewFromBranding
} from "@shared/services/notifications.service";
import {AxiosError} from "axios";

interface PracticeBrandingInterface {
    primaryColor: string;
    hoverColor: string;
    focusedColor: string;
    secondaryColor: string;
    tertiaryColor: string;
}
const PracticeBrandingEdit = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { handleSubmit, control, formState, reset } = useForm({ mode: 'onChange' });
    const [logoPath, setLogoPath] = useState<string>()
    const { isFetching, data, refetch } = useQuery<PracticeBranding>(GetPracticeBranding, () => getPracticeBranding(), {
        onSuccess: (data) => {
            setLogoPath(data.logoPath);
            reset({
                primaryColor: data.primaryColor,
                hoverColor: data.hoverColor,
                focusedColor: data.focusedColor,
                secondaryColor: data.secondaryColor,
                tertiaryColor: data.tertiaryColor
            });
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.practice_branding.get_error',
                type: SnackbarType.Error
            }))
        }
    });

    const previewEmailTemplateMutation = useMutation(getPracticeEmailTemplatePreviewFromBranding, {
        onSuccess: (data) => {
            let newTabPreview = window.open("", "_blank");
            newTabPreview?.document.write(data);
        },
        onError: (error: AxiosError) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data?.message ?? 'configuration.practice_branding.get_error',
                type: SnackbarType.Error
            }));
        }
    });
    const previewEmailTemplate = () => {
        if (data) {
            previewEmailTemplateMutation.mutate({
                hoverColor: data.hoverColor,
                focusedColor: data.focusedColor,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                tertiaryColor: data.tertiaryColor
            })
        }
    }

    const savePracticeBrandingMutation = useMutation(savePracticeBranding);
    const uploadLogoMutation = useMutation(uploadAssetFile);

    const onSubmit = (formData: PracticeBrandingInterface) => {
        if (logoPath) {
            const request: PracticeBranding = {
                primaryColor: formData.primaryColor,
                hoverColor: formData.hoverColor,
                focusedColor: formData.focusedColor,
                secondaryColor: formData.secondaryColor,
                tertiaryColor: formData.tertiaryColor,
                logoPath: logoPath
            }
            savePracticeBrandingMutation.mutate(request, {
                onSuccess: () => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Success,
                        message: 'configuration.practice_branding.save_success'
                    }));
                    refetch();
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        message: 'configuration.practice_branding.save_error',
                        type: SnackbarType.Error
                    }))
                }
            });
        }
    }

    const onRestoreDefaultIcon = () => {
        setLogoPath(data?.logoPath);
    }
    const onRestoreDefaultData = () => {
        if (data) {
            setLogoPath(data.logoPath);
            reset();
        }
    }

    const handleImageUpload = (image: File | undefined) => {
        if (image) {
            uploadLogoMutation.mutate(image, {
                onSuccess: (response) => {
                    setLogoPath(response.fileName);
                },
                onError: () => {
                    setLogoPath(data?.logoPath);
                    dispatch(addSnackbarMessage({
                        message: 'configuration.practice_branding.logo_upload_error',
                        type: SnackbarType.Error
                    }))
                }
            })
        }
    }

    return (
        <> {isFetching ? <Spinner fullScreen /> :
            <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-6 flex flex-1 flex-col overflow-y-auto body2'>
                <h5 className='mb-4'> {t('configuration.practice_branding.title')} </h5>
                <p className='mb-6'>{t('configuration.practice_branding.description')}</p>
                <h6 className='mb-3'> {t('configuration.practice_branding.logo_title')} </h6>
                <p className='mb-4'>{t('configuration.practice_branding.logo_description')}</p>
                <div className='flex flex-row mb-6 items-center'>
                    <label className='mr-6'>{t('configuration.practice_branding.logo_label')}</label>
                    <SimpleImageUploader
                        buttonText='configuration.practice_branding.logo_picker_button'
                        uploadedImage={handleImageUpload}
                        onClearImage={() => onRestoreDefaultIcon()}
                        initialSrc={data?.logoPath}
                        src={logoPath}
                    />
                </div>
                <h6 className='mb-3'> {t('configuration.practice_branding.colors_title')} </h6>
                <p className='flex flex-row mb-4'>{t('configuration.practice_branding.colors_description')}</p>
                <div className='color-picker-grid mb-6'>
                    <div className='flex flex-col'>
                        <div> {t('configuration.practice_branding.primary_color_title')}</div>
                        <span className="body3-medium">{t('configuration.practice_branding.primary_color_description')}</span>
                    </div>
                    <div className='ml-20'>
                        <ControlledColorPicker
                            control={control}
                            name={'primaryColor'}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div> {t('configuration.practice_branding.hover_color_title')}</div>
                        <span className="body3-medium">{t('configuration.practice_branding.hover_color_description')}</span>
                    </div>
                    <div className='ml-20'>
                        <ControlledColorPicker
                            control={control}
                            name={'hoverColor'}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div> {t('configuration.practice_branding.focused_color_title')}</div>
                        <span className="body3-medium">{t('configuration.practice_branding.focused_color_description')}</span>
                    </div>
                    <div className='ml-20'>
                        <ControlledColorPicker
                            control={control}
                            name={'focusedColor'}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div> {t('configuration.practice_branding.secondary_color_title')}</div>
                        <span className="body3-medium">{t('configuration.practice_branding.secondary_color_description')}</span>
                    </div>
                    <div className='ml-20'>
                        <ControlledColorPicker
                            control={control}
                            name={'secondaryColor'}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div> {t('configuration.practice_branding.tertiary_color_title')}</div>
                        <span className="body3-medium">{t('configuration.practice_branding.tertiary_color_description')}</span>
                    </div>
                    <div className='ml-20'>
                        <ControlledColorPicker
                            control={control}
                            name={'tertiaryColor'}
                        />
                    </div>
                </div>

                <h6 className='mb-3'> {t('configuration.practice_branding.preview_title')} </h6>
                <Link to={''}
                    className='body2-primary mb-2 hover:underline'
                    target={"_blank"}>{t('configuration.practice_branding.web_form_preview')}</Link>
                <div className='body2-primary mb-8 hover:underline cursor-pointer'
                     onClick={()=> previewEmailTemplate()}
                >
                    {t('configuration.practice_branding.email_template_preview')}
                </div>

                <div className='flex'>
                    <Button
                        type='submit'
                        buttonType='medium'
                        disabled={!formState.isValid}
                        label='common.save'
                        isLoading={savePracticeBrandingMutation.isLoading || uploadLogoMutation.isLoading}
                    />
                    <Button label='common.cancel'
                        className=' ml-8'
                        buttonType='secondary'
                        onClick={() => onRestoreDefaultData()}
                        isLoading={savePracticeBrandingMutation.isLoading || uploadLogoMutation.isLoading} />
                </div>
            </form>
        }
        </>
    )
}
export default PracticeBrandingEdit;