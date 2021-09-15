import {useQuery} from 'react-query';
import {FetchAppParameters} from '@constants/react-query-constants';
import axios, {AxiosResponse} from 'axios';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {setAppParameters} from '@shared/store/app/app.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import App from '@app/app';
import utils from '@shared/utils/utils';

const InitializeApp = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isLoading, isError} = useQuery(FetchAppParameters, () => axios.get(`${process.env.REACT_APP_API_ENDPOINT}/parameters`,{
            headers: {
            'X-Api-Key': process.env.REACT_APP_AWS_API_KEY
            }
        }
    ), {
        enabled:!utils.getAppParameter('AwsRegion'),
        onSuccess: (response: AxiosResponse) => {
            dispatch(setAppParameters(response.data));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'app.error_loading_parameters'
            }))
        }
    })

    if (isError) {
        return <div>{t('app.error_loading_parameters')}</div>
    }

    if (isLoading) {
        return <div className='w-full h-full'>
            <Spinner fullScreen title='app.loading_parameters'/>
        </div>
    }

    return <App/>
}

export default InitializeApp;
