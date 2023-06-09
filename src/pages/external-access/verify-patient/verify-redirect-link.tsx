import {useHistory, useParams} from 'react-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {GetRedirectLink} from '@constants/react-query-constants';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import Spinner from '@components/spinner/Spinner';
import {AxiosError} from 'axios';
import {getRedirectLink} from '@shared/services/notifications.service';
import {useDispatch, useSelector} from 'react-redux';
import {clearState, setRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {selectVerifiedLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {logOut} from '@shared/store/app-user/appuser.slice';
import {clearVerifiedPatient} from '@pages/patients/store/patients.slice';

interface RedirectLinkParams {
    linkId: string
}

const VerifyRedirectLink = () => {
    const { t } = useTranslation();
    const { linkId } = useParams<RedirectLinkParams>();
    const dispatch = useDispatch();
    const history = useHistory();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const verifiedLink = useSelector(selectVerifiedLink);
    const {isLoading, isError, error} = useQuery<RedirectLink, AxiosError>([GetRedirectLink, linkId], () =>
            getRedirectLink(linkId),
        {
            enabled:!!linkId,
            onSuccess: (data: RedirectLink) => {
                if (verifiedLink !== linkId) {
                    dispatch(clearState());
                }
                if (verifiedPatient?.patientId.toString() !== data.patientId) {
                    dispatch(clearVerifiedPatient());
                    dispatch(logOut());
                }
                dispatch(setRedirectLink(data));
                if (data.requestType === ExternalAccessRequestTypes.DownloadMedicalRecords) {
                    history.push('/o/download-medical-records');
                } else if (data.requestType === ExternalAccessRequestTypes.RegisterNewPatient) {
                    history.push('/o/registration');
                } else if (data.requestType === ExternalAccessRequestTypes.FeedbackRating) {
                    history.push(`/o/feedback/${data.ticketId}`);
                } else {
                    history.push('/o/verify-patient-get-mobile');
                }
            }
        }
    );

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        if (error?.response?.status === 404) {
            return <div>{t('redirect_link.link_not_valid')}</div>;
        } else if (error?.response?.status === 409) {
            return <div>{t('redirect_link.link_not_active')}</div>;
        }
        else
        {
            return <div>{t('redirect_link.is_error')}</div>
        }
    }
    return (
        <div>
            <span>{t('redirect_link.link_not_active')}</span>
        </div>
    );
}

export default VerifyRedirectLink;
