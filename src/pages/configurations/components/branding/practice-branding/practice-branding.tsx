import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { ConfigurationsPath } from '@app/paths';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import Confirmation from '@components/confirmation/confirmation';

interface PracticeBrandingInterface {
    primaryColor: string;
    hoverColor: string;
    focusedColor: string;
    secondaryColor: string;
    tertiaryColor: string;
}
const PracticeBrandingEdit = () => {
    const defaultImageName = 'practice-logo.svg';
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const { handleSubmit, control, formState, reset } = useForm({ mode: 'onChange' });
    const [logoPath, setLogoPath] = useState<string>();
    const [colors, setColors] = useState<PracticeBrandingInterface>();
    const [warning, setWarning] = useState<boolean>(false);
    const { isFetching, data, refetch } = useQuery<PracticeBranding>(GetPracticeBranding, () => getPracticeBranding(), {
        onSuccess: (data) => {
            setLogoPath(data.logoPath);
            let defaultColor = {
                primaryColor: data.primaryColor,
                hoverColor: data.hoverColor,
                focusedColor: data.focusedColor,
                secondaryColor: data.secondaryColor,
                tertiaryColor: data.tertiaryColor
            }
            setColors(defaultColor);
            reset(defaultColor);
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
        if (colors && logoPath) {
            previewEmailTemplateMutation.mutate({
                hoverColor: colors.hoverColor,
                focusedColor: colors.focusedColor,
                primaryColor: colors.primaryColor,
                secondaryColor: colors.secondaryColor,
                tertiaryColor: colors.tertiaryColor,
                headerImage: logoPath
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

    const onRestoreDefaultIcon = (isReturnDefault?: boolean) => {
        if(isReturnDefault) {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Info,
                message: 'configuration.practice_branding.returned_to_default_logo'
            }));
            setLogoPath(defaultImageName);
        }else{
            dispatch(addSnackbarMessage({
                type: SnackbarType.Info,
                message: 'configuration.practice_branding.returned_to_current_logo'
            }));
            setLogoPath(data?.logoPath);
        }
        
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
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Info,
                        message: 'configuration.practice_branding.uploaded_new_logo'
                    }));
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

    const updateCurrentColor = (name: string, value: string) => {
        if(colors){
            setColors({
                primaryColor: colors.primaryColor,
                hoverColor: colors.hoverColor,
                focusedColor: colors.focusedColor,
                secondaryColor: colors.secondaryColor,
                tertiaryColor: colors.tertiaryColor,
                [name]: value
            });
        }
    }

    return (
        <div className='practice-branding overflow-auto h-full pr-4'> {isFetching ? <Spinner fullScreen /> :
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
                        onClearImage={(isReturnDefault) => onRestoreDefaultIcon(isReturnDefault)}
                        defaultImageSrc={defaultImageName}
                        initialSrc={data?.logoPath}
                        src={logoPath}
                        acceptFileFormats={'.png, .svg, .gif'}
                        isTransparentBackground={true}
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
                            onChangeColor={(key: string, color: string) => updateCurrentColor(key, color)}
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
                            onChangeColor={(key: string, color: string) => updateCurrentColor(key, color)}
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
                            onChangeColor={(key: string, color: string) => updateCurrentColor(key, color)}
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
                            onChangeColor={(key: string, color: string) => updateCurrentColor(key, color)}
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
                            onChangeColor={(key: string, color: string) => updateCurrentColor(key, color)}
                        />
                    </div>
                </div>

                <h5 className='practice-branding-header-bottom-margin subtitle2'> {t('configuration.practice_branding.preview_title')} </h5>
                <h5 className='practice-branding-subheader-bottom-margin body2-primary cursor-pointer w-max hover:underline' onClick={() => window.open(`${ConfigurationsPath}/web-form-preview?isPreview=true&logoPath=${logoPath}&primaryColor=${colors?.primaryColor.replaceAll('#', '')}&secondaryColor=${colors?.secondaryColor.replaceAll('#', '')}&hoverColor=${colors?.hoverColor.replaceAll('#', '')}&focusedColor=${colors?.focusedColor.replaceAll('#', '')}&tertiaryColor=${colors?.tertiaryColor.replaceAll('#', '')}`, '_blank', 'noopener,noreferrer')}>{t('configuration.practice_branding.web_form_preview')}</h5>
                <div className='body2-primary practice-branding-subheader2-bottom-margin cursor-pointer w-max hover:underline'
                     onClick={()=> previewEmailTemplate()}
                >
                    {t('configuration.practice_branding.email_template_preview')}
                </div>

                <div className='flex'>
                    <Button
                        type='submit'
                        buttonType='medium'
                        disabled={!formState.isValid || uploadLogoMutation.isLoading}
                        label='common.save'
                        isLoading={savePracticeBrandingMutation.isLoading }
                    />
                    <Button label='common.cancel'
                        className=' ml-8'
                        buttonType='secondary'
                        onClick={() => formState.isDirty && setWarning(true)}
                        disabled={savePracticeBrandingMutation.isLoading} />
                    <RouteLeavingGuard
                        when={formState.isDirty && !formState.isSubmitSuccessful}
                        navigate={path => history.push(path)}
                        message={'configuration.practice_branding.warning_info_leaving'}
                        title={'configuration.practice_branding.warning'}
                    />
                    <Confirmation
                            onClose={() => setWarning(false)}
                            onCancel={() => setWarning(false)}
                            okButtonLabel={'common.ok'}
                            onOk={() => {setWarning(false); onRestoreDefaultData()}}
                            title={'configuration.practice_branding.warning'}
                            message={'configuration.practice_branding.warning_info'}
                            isOpen={warning} />
                </div>
            </form>
        }
        </div>
    )
}
export default PracticeBrandingEdit;
