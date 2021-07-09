import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getRedirectLink } from './services/link.service';
import HipaaVerification from './hipaa-verification';
import {useQuery} from 'react-query';
import {GetRedirectLink} from '@constants/react-query-constants';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import Spinner from '@components/spinner/Spinner';

interface RedirectLinkParams {
    linkId: string
}

const VerifyRedirectLink = () => {
    const { t } = useTranslation();
    const { linkId } = useParams<RedirectLinkParams>();
    const {isLoading, isError, data} = useQuery<RedirectLink, Error>([GetRedirectLink, linkId], () =>
            getRedirectLink(linkId)
    );

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        return <div className='text-danger'>{t('redirect_link.is_error')}</div>
    }

    if (data) {
        return <HipaaVerification request={data} />
    }

    return (
        <div>
            <span className='text-danger'>{t('redirect_link.link_not_active')}</span>
        </div>
    );
}

export default VerifyRedirectLink;
