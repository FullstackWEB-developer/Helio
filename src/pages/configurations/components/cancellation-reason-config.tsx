import React from 'react';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import {GetCancellationReasonsEditable} from '@constants/react-query-constants';
import {getCancellationReasonsEditable} from '@pages/appointments/services/appointments.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';

const CancellationReasonConfig = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isLoading, data} = useQuery(GetCancellationReasonsEditable, () => getCancellationReasonsEditable(), {
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.cancellation_reason.error_fetching_reasons',
                type: SnackbarType.Error
            }))
        }
    });
    return (
        <div className='px-6 pt-7 flex flex-col'>
            <h6 className='pb-7'>{t('configuration.cancellation_reason.title')}</h6>
            <div className='body2 whitespace-pre-line'>{t('configuration.cancellation_reason.description')}</div>
            {isLoading && <Spinner className='px-2' />}
        </div>
    )
}

export default CancellationReasonConfig;