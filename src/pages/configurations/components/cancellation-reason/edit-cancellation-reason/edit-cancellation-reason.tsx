import {CancellationReasonsPath, ConfigurationsPath} from '@app/paths';
import {Option} from '@components/option/option';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {useMutation, useQuery} from 'react-query';
import {Icon} from '@components/svg-icon';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {ControlledSelect, ControlledInput, ControlledTextArea} from "@components/controllers";
import {
    SaveCancellationReason,
    DeleteCancellationReason,
    getCancellationReasonsEditable
} from '@pages/appointments/services/appointments.service';
import {useForm} from 'react-hook-form';
import Button from '@components/button/button';
import './edit-cancellation-reason.scss'
import {CancellationReasonExtended} from '@pages/configurations/models/CancellationReasonExtended';
import {useState} from 'react';
import {CancellationReasonSaveRequest} from '@pages/appointments/models/cancellation-reason-save-request';
import {GetCancellationReasonsEditable} from '@constants/react-query-constants';
import dayjs from 'dayjs';
import Confirmation from '@components/confirmation/confirmation';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import Spinner from "@components/spinner/Spinner";

interface CancellationReasonForm {
    description: string;
    name: string;
    intentName: string
}

const EditCancellationReason = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams<{ id: string }>();
    const [intentNames, setIntentNames] = useState<Option[]>([]);
    const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState<boolean>(false);
    const [cancellationReason, setCancellationReason] = useState<CancellationReasonExtended>();
    const {isFetching} = useQuery<CancellationReasonExtended[]>(GetCancellationReasonsEditable, () => getCancellationReasonsEditable(), {
        onSuccess: (data) => {
            const options = [...new Map(data.map(item =>
                [item['intentName'], item])).values()].map(x => {
                return {value: x.intentName, label: x.intentName} as Option
            });
            setIntentNames(options);
            setCancellationReason(data.find(x => x.id === parseInt(id)));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.cancellation_reason.error_fetching_reasons',
                type: SnackbarType.Error
            }))
        }
    });
    const updateCancellationReasonMutation = useMutation(SaveCancellationReason);

    const onSubmit = (formData: CancellationReasonForm) => {
        if (cancellationReason) {
            const request: CancellationReasonSaveRequest = {
                id: cancellationReason?.id,
                name: formData.name,
                intentName: formData.intentName,
                description: formData.description,
                type: cancellationReason?.type
            }
            updateCancellationReasonMutation.mutate(request, {
                onSuccess: () => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Success,
                        message: 'configuration.cancellation_reason.save_success'
                    }));
                    navigateBackToCancelationReasonsList();
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        message: 'configuration.cancellation_reason.save_error',
                        type: SnackbarType.Error
                    }))
                }
            });
        }

    }
    const {handleSubmit, control, formState: {isValid, isDirty, isSubmitSuccessful}, reset} = useForm({mode: 'all'});

    const navigateBackToCancelationReasonsList = () => {
        const pathName = `${ConfigurationsPath}${CancellationReasonsPath}`;
        history.push({
            pathname: pathName,
        });
    }
    const deleteCancellationReasonMutation = useMutation(DeleteCancellationReason);
    const handleDeleteClick = () => {
        setDeleteConfirmationOpened(false);
        if (cancellationReason)
            deleteCancellationReasonMutation.mutate(cancellationReason.id, {
                onSuccess: () => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Success,
                        message: 'configuration.cancellation_reason.delete_success'
                    }));
                    reset();
                    navigateBackToCancelationReasonsList();
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        message: 'configuration.cancellation_reason.save_error',
                        type: SnackbarType.Error
                    }))
                }
            });
    }

    const DisplayToolTip = (message: string) => {
        return <ToolTipIcon
            icon={Icon.Error}
            iconFillClass='rgba-05-fill'
            placement='right-start'
            iconClassName='cursor-pointer icon'
        >
            <div className='flex flex-col p-6 w-80'>
                <span className='body2'>{message}</span>
            </div>
        </ToolTipIcon>
    }
    return (
        <> {isFetching ? <Spinner fullScreen={true} className='flex-1'/> :
            cancellationReason &&
            <form onSubmit={handleSubmit(onSubmit)}
                  className='px-6 pt-7 flex flex-1 flex-col group overflow-y-auto body2'>
                <div id="title-container" className='flex flex-row pb-4'>
                    <h6 className='details-label'> {cancellationReason.id}: </h6>
                    <h6 className='pl-3'> {cancellationReason.name}</h6>
                </div>
                <div className='flex flex-row pt-6'>
                    <div className=' flex flex-row w-1/3'>
                        <div className='flex flex-col details-label'>
                            <span>{t('configuration.cancellation_reason.details.created_by')} </span>
                            <span> {t('configuration.cancellation_reason.details.created_date')} </span>
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span>{cancellationReason.createdByName ?? t('common.not_available')}</span>
                            <span> {cancellationReason.createdByName ? dayjs.utc(cancellationReason.createdOn).local().format('MMM DD, YYYY') : t('common.not_available')}</span>
                        </div>
                    </div>
                    <div className='flex flex-col details-label'>
                        <span>{t('configuration.cancellation_reason.details.modified_by')} </span>
                        <span> {t('configuration.cancellation_reason.details.modified_date')} </span>
                    </div>
                    <div className='flex flex-col ml-4'>
                        <span>{cancellationReason.modifiedByName ?? t('common.not_available')}</span>
                        <span>{cancellationReason.modifiedByName ? dayjs.utc(cancellationReason.modifiedOn).local().format('MMM DD, YYYY') : t('common.not_available')}</span>
                    </div>
                </div>

                <div className="mt-10 flex flex-row items-center">
                    <div className='w-1/3'>
                        <ControlledInput name='name' control={control}
                                         defaultValue={cancellationReason.name}
                                         label={'configuration.cancellation_reason.details.helio_appointment_cancelation_name'}
                                         required={true}
                                         autosuggestDropdown={false}
                                         autosuggestOptions={[]}
                        />
                    </div>
                    {DisplayToolTip(t('configuration.cancellation_reason.details.helio_appointment_cancelation_name_tooltip'))}
                </div>

                <div className="mt-8 flex flex-row items-center">
                    <div className='pr-2'>
                        {t('configuration.cancellation_reason.details.appointment_cancelation_description')}
                    </div>
                    {DisplayToolTip(t('configuration.cancellation_reason.details.appointment_cancelation_description_tooltip'))}
                </div>
                <div className='pr-24'>
                    <ControlledTextArea control={control} name='description'
                                        defaultValue={cancellationReason.description}
                                        className='body2 w-full p-4'
                                        overwriteDefaultContainerClasses={true}
                                        maxLength={50}
                                        resizable={false} rows={4}/>
                </div>
                <div className="mt-8 flex flex-row items-center">
                    <div className='w-1/3'>
                        <ControlledSelect
                            name="intentName"
                            control={control}
                            required={true}
                            defaultValue={cancellationReason.intentName}
                            label='configuration.cancellation_reason.details.reason_mapping'
                            options={intentNames}
                            onSelect={() => {
                            }}
                        />
                    </div>
                    {DisplayToolTip(t('configuration.cancellation_reason.details.reason_mapping_tooltip'))}
                </div>
                <div className='flex mt-10'>
                    <Button
                        type='submit'
                        buttonType='medium'
                        label='common.save'
                        disabled={!isDirty || !isValid}
                        isLoading={updateCancellationReasonMutation.isLoading}
                    />

                    <Button label='common.cancel' className=' ml-8 mr-8' buttonType='secondary' data-testid='go-back-to-list'
                            onClick={() => navigateBackToCancelationReasonsList()}
                            disabled={updateCancellationReasonMutation.isLoading || deleteCancellationReasonMutation.isLoading}/>
                    <Button label='common.delete' className='mr-8' buttonType='secondary'
                            onClick={() => setDeleteConfirmationOpened(true)}
                            disabled={!cancellationReason.isMapped}
                            isLoading={deleteCancellationReasonMutation.isLoading}/>
                </div>
            </form>

        }
            <RouteLeavingGuard
                when={isDirty && !isSubmitSuccessful}
                navigate={path => history.push(path)}
            />
            <Confirmation
                title={t('configuration.cancellation_reason.confirm_delete_title', {cancellationReason: `${cancellationReason?.id} ${cancellationReason?.name}`})}
                okButtonLabel={t('contacts.contact_details.confirm_delete_yes')} isOpen={deleteConfirmationOpened}
                onOk={() => handleDeleteClick()} onCancel={() => setDeleteConfirmationOpened(false)}
                onClose={() => setDeleteConfirmationOpened(false)} closeableOnEscapeKeyPress={true}/>
        </>
    )
}
export default EditCancellationReason;
