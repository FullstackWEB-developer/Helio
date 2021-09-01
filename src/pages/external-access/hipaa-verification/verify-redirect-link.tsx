import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {useQuery} from 'react-query';
import {GetRedirectLink} from '@constants/react-query-constants';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import Spinner from '@components/spinner/Spinner';
import {AxiosError} from 'axios';
import GetExternalUserMobileNumber from '@pages/external-access/verify-patient/get-external-user-mobile-number';
import {getRedirectLink} from '@shared/services/notifications.service';

interface RedirectLinkParams {
    linkId: string
}

const VerifyRedirectLink = () => {
    const { t } = useTranslation();
    const { linkId } = useParams<RedirectLinkParams>();
    const {isLoading, isError, data, error} = useQuery<RedirectLink, AxiosError>([GetRedirectLink, linkId], () =>
            getRedirectLink(linkId),
        {
            enabled:!!linkId
        }
    );

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        if (error?.response?.status === 404) {
            return <div className='text-danger'>{t('redirect_link.link_not_valid')}</div>;
        }
        else
        {
            return <div className='text-danger'>{t('redirect_link.is_error')}</div>
        }
    }

    if (data) {
        return <GetExternalUserMobileNumber request={data} />
    }

    return (
        <div>
            <span className='text-danger'>{t('redirect_link.link_not_active')}</span>
        </div>
    );
}

export default VerifyRedirectLink;
