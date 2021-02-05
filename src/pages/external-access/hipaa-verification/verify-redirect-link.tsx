import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { selectRedirectLink, selectIsRedirectLinkLoading, selectIsRedirectLinkError } from './store/redirect-link.selectors';
import { getRedirectLink } from './services/link.service';
import HipaaVerification from './hipaa-verification';
import { setPatientIsVerified } from '../../patients/store/patients.slice';

interface RedirectLinkParams {
    linkId: string
}

const VerifyRedirectLink = () => {
    const { t } = useTranslation();
    const { linkId } = useParams<RedirectLinkParams>();
    const dispatch = useDispatch();

    const isError = useSelector(selectIsRedirectLinkError);
    const isLoading = useSelector(selectIsRedirectLinkLoading)
    const redirectLink = useSelector(selectRedirectLink);

    useEffect(() => {
        dispatch(setPatientIsVerified(false));
        dispatch(getRedirectLink(linkId));
    }, [dispatch, linkId]);

    return (
        <div className="container mx-auto my-10">
            <div hidden={!isLoading}>
                <ThreeDots />
            </div>
            {
                !isLoading && !isError && redirectLink !== undefined
                    ? <HipaaVerification />
                    : <div hidden={isLoading || isError} className={"p-4"}>
                        <span className={"text-xl"}>{t('redirect_link.link_not_active')}</span>
                    </div>
            }
            <div hidden={!isError} className={"p-4 text-red-500"}>{t('redirect_link.is_error')}</div>
        </div>
    );
}

export default VerifyRedirectLink;
