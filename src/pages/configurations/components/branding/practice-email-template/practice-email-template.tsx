import {Trans, useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useForm} from 'react-hook-form';
import Button from '@components/button/button';
import { GetPracticeEmailTemplate} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import {uploadAssetFile} from '@shared/services/lookups.service';
import SimpleImageUploader from '@components/simple-image-uploader/simple-image-uploader';
import {useState} from 'react';
import {
    getPracticeEmailTemplate, getPracticeEmailTemplatePreview,
    savePracticeEmailTemplate
} from "@shared/services/notifications.service";
import {PracticeEmailTemplate} from "@pages/configurations/models/practice-email-template";
import {PracticeEmailTemplateInterface} from "@pages/configurations/models/PracticeEmailTemplateInterface";
import {ControlledTextArea} from "@components/controllers";
import {Link} from "react-router-dom";
import {PracticeBrandingPath} from "@app/paths";
import {AxiosError} from "axios";

const PracticeEmailTemplateEdit = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient()
    const {handleSubmit, control, formState, reset, setValue} = useForm<PracticeEmailTemplateInterface>({mode: 'onChange'});
    const [headerImageName, setHeaderImageName] = useState<string>()
    const [footerImageName, setFooterImageName] = useState<string>()
    const {
        isFetching,
        data
    } = useQuery<PracticeEmailTemplate>(GetPracticeEmailTemplate, () => getPracticeEmailTemplate(), {
        onSuccess: (data) => {
            setHeaderImageName(data.headerImage);
            setFooterImageName(data.footerImage);
            reset({
                footerDisclaimer: data.footerDisclaimer
            });
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.practice_email_template.get_error',
                type: SnackbarType.Error
            }))
        }
    });
    const savePracticeEmailTemplateMutation = useMutation(savePracticeEmailTemplate);
    const uploadLogoMutation = useMutation(uploadAssetFile);

    const onSubmit = (formData: PracticeEmailTemplateInterface) => {
        if (headerImageName && footerImageName) {
            let disclaimer = formData.footerDisclaimer.replaceAll('<p>', '<tr><td>')
            disclaimer = disclaimer.replaceAll('</p>', '</td></tr>')
            const request: PracticeEmailTemplate = {
                footerDisclaimer: disclaimer,
                headerImage: headerImageName,
                footerImage: footerImageName,
            }
            savePracticeEmailTemplateMutation.mutate(request, {
                onSuccess: (response) => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Success,
                        message: 'configuration.practice_email_template.save_success'
                    }));
                    queryClient.setQueryData([GetPracticeEmailTemplate], response);
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        message: 'configuration.practice_email_template.save_error',
                        type: SnackbarType.Error
                    }))
                }
            });
        }
    }

    const onRestoreDefaultData = () => {
        setValue("footerDisclaimer",data?.defaultFooterDisclaimer);
    }

    const onCancel = () => {
        setFooterImageName(data?.footerImage);
        setHeaderImageName(data?.headerImage);
        setValue("footerDisclaimer",data?.footerDisclaimer);
    }
    const previewEmailTemplateMutation = useMutation(getPracticeEmailTemplatePreview, {
        onSuccess: (data) => {
            let newTabPreview = window.open("", "_blank");
            newTabPreview?.document.write(data);
        },
        onError: (error: AxiosError) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data?.message ?? 'configuration.practice_email_template.get_error',
                type: SnackbarType.Error
            }));
        }
    });
    const previewEmailTemplate = () => {
        if (data && headerImageName && footerImageName) {
            let disclaimer = data.footerDisclaimer.replaceAll('<p>', '<tr><td>')
            disclaimer = disclaimer.replaceAll('</p>', '</td></tr>')
            previewEmailTemplateMutation.mutate({
                headerImage: headerImageName,
                footerImage: footerImageName,
                footerDisclaimer: disclaimer
            })
        }
    }
    const handleImageUpload = (image: File | undefined, setImageFunc: React.Dispatch<React.SetStateAction<string | undefined>>, onErrorImageName: string | undefined) => {
        if (image) {
            uploadLogoMutation.mutate(image, {
                onSuccess: (response) => {
                    setImageFunc(response.fileName);
                },
                onError: () => {
                    setImageFunc(onErrorImageName);
                    dispatch(addSnackbarMessage({
                        message: 'configuration.practice_email_template.logo_upload_error',
                        type: SnackbarType.Error
                    }))
                }
            })
        }
    }

    return (
        <> {isFetching ? <Spinner fullScreen/> :
            <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-6 flex flex-1 flex-col overflow-y-auto body2'>
                <h5 className='mb-4'> {t('configuration.practice_email_template.title')} </h5>
                <p className='mb-6'>{t('configuration.practice_email_template.description')}</p>
                <div className='subtitle mb-3'> {t('configuration.practice_email_template.logo_title')} </div>
                <p className='mb-4'>
                    <Trans i18nKey="configuration.practice_email_template.logo_description">
                        <span className='text-danger'></span>
                    </Trans>
                </p>
                <div className='mb-6'>
                    <div className='flex flex-row mb-4 items-center'>
                        <label className='mr-6'>{t('configuration.practice_email_template.header_logo_label')}</label>
                        <SimpleImageUploader
                            buttonText='configuration.practice_email_template.logo_picker_button'
                            uploadedImage={(image) => handleImageUpload(image, setHeaderImageName, data?.headerImage)}
                            onClearImage={() => setHeaderImageName(data?.headerImage)}
                            initialSrc={data?.headerImage}
                            src={headerImageName}
                        />
                    </div>
                    <div className='flex flex-row mb-6 items-center'>
                        <label className='mr-6'>{t('configuration.practice_email_template.footer_logo_label')}</label>
                        <SimpleImageUploader
                            buttonText='configuration.practice_email_template.logo_picker_button'
                            uploadedImage={(image) => handleImageUpload(image, setFooterImageName, data?.footerImage)}
                            onClearImage={() => setFooterImageName(data?.footerImage)}
                            initialSrc={data?.footerImage}
                            src={footerImageName}
                        />
                    </div>
                </div>
                <div
                    className='mb-3 subtitle'> {t('configuration.practice_email_template.customize_color_title')} </div>
                <div className='body2 mb-8 flex whitespace-pre'>
                    <Trans i18nKey="configuration.practice_email_template.customize_color_description">
                        <Link to={PracticeBrandingPath}
                              data-testid='configuration.practice_email_template.customize_color_description'
                              className='body2-primary hover:underline flex items-center h-full'
                              target={"_blank"}></Link>
                    </Trans>
                </div>
                <div className='flex flex-row justify-between mb-2'>
                    <div
                        className='mb-3 subtitle'> {t('configuration.practice_email_template.email_footer_disclaimer')} </div>
                    <Button label='configuration.practice_email_template.reset_to_default_button'
                            data-testid='configuration.practice_email_template.reset_to_default_button'
                            buttonType='secondary'
                            onClick={() => onRestoreDefaultData()}
                            disabled={savePracticeEmailTemplateMutation.isLoading || uploadLogoMutation.isLoading}/>
                </div>

                <div className='mb-8'>
                    <ControlledTextArea control={control}
                                        data-testid='practice-email-template-footer-disclaimer'
                                        name='footerDisclaimer'
                                        required={true}
                                        hyperLinkButton={true}
                                        showSendIconInRichTextMode={false}
                                        toggleRichTextMode={true}
                                        hideFormattingButton={true}/>
                </div>

                <div className='flex'>
                    <Button
                        data-testid='save-practice-email-template'
                        type='submit'
                        buttonType='medium'
                        disabled={!formState.isValid}
                        label='common.save'
                        isLoading={savePracticeEmailTemplateMutation.isLoading || uploadLogoMutation.isLoading}
                    />
                    <Button label='configuration.practice_email_template.button_preview'
                            className=' ml-8'
                            buttonType='secondary'
                            onClick={() => previewEmailTemplate()}
                            disabled={savePracticeEmailTemplateMutation.isLoading || uploadLogoMutation.isLoading}/>
                    <Button label='common.cancel'
                            className=' ml-8'
                            buttonType='secondary'
                            onClick={() => onCancel()}
                            disabled={savePracticeEmailTemplateMutation.isLoading || uploadLogoMutation.isLoading}/>
                </div>
            </form>
        }
        </>
    )
}
export default PracticeEmailTemplateEdit;
