import Spinner from '@components/spinner/Spinner';
import {GetProviderPicture} from '@constants/react-query-constants';
import {getProviderPicture} from '@shared/services/user.service';
import React from 'react';
import {useQuery} from 'react-query';
import './provider-picture.scss';

const ProviderPicture = ({providerId}: {providerId?: number}) => {

    const {data: providerPicture, isFetching} = useQuery([GetProviderPicture, providerId],
        () => getProviderPicture(providerId!),
        {
            enabled: !!providerId
        }
    );

    if(isFetching){
        return <Spinner className='w-24 h-24 mr-6' />
    }
    return providerPicture ? <img src={providerPicture} className='w-24 h-24 mr-6 rounded-full' alt='provider' /> : null;
}

export default ProviderPicture;
