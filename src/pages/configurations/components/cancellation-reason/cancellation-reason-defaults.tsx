import {GetCancellationReasons} from '@constants/react-query-constants';
import {getCancellationReasons, saveCancellationReasonDefaults} from '@pages/appointments/services/appointments.service';
import {CancellationReasonTypes} from '@pages/external-access/models/cancellation-reason-types.enum';
import {CancellationReason} from '@shared/models/cancellation-reason.model';
import React, {useCallback} from 'react';
import {useMutation, useQuery} from 'react-query';
import {Option} from '@components/option/option';
import {Trans, useTranslation} from 'react-i18next';
import {ControlledSelect} from '@components/controllers';
import {useForm} from 'react-hook-form';
import utils from '@shared/utils/utils';
import Spinner from '@components/spinner/Spinner';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

const CancellationReasonDefaults = () => {

    const {t} = useTranslation();
    const {isFetching, data: cancellationReasons} = useQuery<CancellationReason[]>([GetCancellationReasons], () =>
        getCancellationReasons()
    );
    const dispatch = useDispatch();

    const getCancellationReasonsOptions = useCallback((reasons: CancellationReason[] | undefined) => {
        return reasons ? reasons
            .filter(r => r.type === CancellationReasonTypes.Cancel)
            .map((item: CancellationReason) => {
                return {
                    value: item.id.toString(),
                    label: item.name,
                    object: item
                } as Option;
            }) : [];
    }, [cancellationReasons]);
    const cancellationDropdownItems = getCancellationReasonsOptions(cancellationReasons);

    const {control, getValues} = useForm();

    const onSelect = () => {
        const defaultIdForCancelType = getValues('DefaultIdForCancelType');
        saveDefaultCancellationReasonsMutation.mutate({
            defaultIdForCancelType: utils.isString(defaultIdForCancelType) ? Number(defaultIdForCancelType) : defaultIdForCancelType.object.id});
    }
    const saveDefaultCancellationReasonsMutation = useMutation(saveCancellationReasonDefaults, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message:'configuration.cancellation_reason.save_default_success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message:'configuration.cancellation_reason.save_default_error'
            }));
        }
    });

    return (
        !isFetching && cancellationReasons ?
            <div className='pt-8'>
                {
                    cancellationDropdownItems && cancellationDropdownItems.length > 0 &&
                    <div className='flex items-center body2'>
                        <Trans i18nKey="configuration.cancellation_reason.set_default"
                            values={{reason: t('configuration.cancellation_reason.cancellation_reason_option')}}>
                            <span className='subtitle2 px-1'></span>
                        </Trans>
                        <div className='w-80 pl-6 pr-4 flex items-center'>
                            {
                                saveDefaultCancellationReasonsMutation.isLoading && <Spinner size='small' />
                            }
                            <ControlledSelect
                                disabled={saveDefaultCancellationReasonsMutation.isLoading}
                                options={cancellationDropdownItems}
                                control={control}
                                label='configuration.cancellation_reason.default_reason_label'
                                defaultValue={cancellationDropdownItems.find(r => r.object?.isDefault)}
                                name='DefaultIdForCancelType'
                                onSelect={onSelect}
                            />
                        </div>
                        <span>{t('configuration.cancellation_reason.as_default')}</span>
                    </div>

                }
            </div> : null
    );
}

export default CancellationReasonDefaults;
