import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import SvgIcon, {Icon} from '@components/svg-icon';
import {GetPatientTicketRating, GetUserDetail} from '@constants/react-query-constants';
import {PatientRating} from '@pages/tickets/models/patient-rating.model';
import {getPatientTicketRating, togglePatientRatingApplianceToTicket} from '@pages/tickets/services/tickets.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';
import './patient-ratings-popup.scss';
import {getUserDetailExtended} from '@shared/services/user.service';
import Avatar from '@components/avatar';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import ToggleSwitch from '@components/toggle-switch/toggle-switch';

const PatientRatingsPopup = ({ticketId}: {ticketId: string}) => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const {t} = useTranslation();
    const {data, isFetching} = useQuery<PatientRating>([GetPatientTicketRating, ticketId], () => getPatientTicketRating(ticketId), {
        enabled: !!ticketId,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'patient_ratings.rating_fetch_error'
            }));
        }
    });
    const displayRating = useMemo(() => {
        switch (data?.rating) {
            case -1:
                return <div className='flex items-center subtitle'>
                    <SvgIcon fillClass='rating-widget-unsatisfied' className='icon-large mr-3' type={Icon.RatingDissatisfied} />
                    {t('patient_ratings.dissatisified')}
                </div>;
            case 1:
                return <div className='flex items-center subtitle'><SvgIcon fillClass='rating-widget-satisfied' className='icon-large mr-3'
                    type={Icon.RatingVerySatisfied} />
                    {t('patient_ratings.satisfied')}
                </div>;
            case 0:
                return <div className='flex items-center subtitle'><SvgIcon fillClass='rating-widget-neutral' className='icon-large mr-3'
                    type={Icon.RatingSatisfied} />
                    {t('patient_ratings.very_satisfied')}
                </div>;
            default:
                return null;
        }
    }, [data]);

    const {data: agent, isFetching: isFetchingAgent} = useQuery([GetUserDetail, data?.appliedTo], () => getUserDetailExtended(data?.appliedTo!),
        {
            enabled: !!data?.appliedTo
        })

    const hasTogglePermission = useCheckPermission('Tickets.UpdateIsAppliedOnPatientReview');

    const toggleRatingApplianceMutation = useMutation(togglePatientRatingApplianceToTicket, {
        onSuccess: (data: PatientRating) => {
            queryClient.setQueryData([GetPatientTicketRating, ticketId], data);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'patient_ratings.rating_appliance_error'
            }));
        }
    });

    const handleToggle = (isApplied: boolean) => {
        if (data?.id) {
            toggleRatingApplianceMutation.mutate({id: data.id, isApplied: !isApplied});
        }
    }

    return (
        <div className='flex flex-col pb-11 patient-ratings-popup'>
            {
                isFetching ? <div className='py-4'><Spinner /></div> :
                    <>
                        <div className='flex items-center justify-between pt-3 pb-7'>
                            {displayRating}
                            {data?.createdOn && <span className='body2'>{dayjs.utc(data.createdOn).local().format('MMM D, YYYY h:mm A')}</span>}
                        </div>
                        {
                            (data?.appliedToName || data?.appliedTo) &&
                            <div className='border-t border-b py-3 flex justify-between items-center'>
                                {
                                    !hasTogglePermission && !data?.isApplied &&
                                    <div className='body-2'>{t('patient_ratings.rating_not_applied')}</div>
                                }
                                {
                                    (hasTogglePermission || data?.isApplied) &&
                                    <>
                                        <div className='flex items-center'>
                                            <div className='pr-4'>
                                                {
                                                    isFetchingAgent ? <Spinner size='small' /> :
                                                        <Avatar userPicture={agent?.user.profilePicture}
                                                            userFullName={`${agent?.user?.firstName} ${agent?.user?.lastName}`}
                                                            status={agent?.user.latestConnectStatus as UserStatus}
                                                            displayStatus={true} />
                                                }
                                            </div>
                                            <div className='flex flex-col body2'>
                                                <span className='body3'>{t('patient_ratings.agent')}</span>
                                                {data.appliedToName}
                                            </div>
                                        </div>
                                        {
                                            hasTogglePermission &&
                                            <div className='body2 flex items-center'>
                                                {t('patient_ratings.dont_apply')}
                                                <div className='pl-4'>
                                                    <ToggleSwitch isChecked={!data.isApplied} onSwitch={handleToggle} disabled={toggleRatingApplianceMutation.isLoading} />
                                                </div>
                                                {
                                                    toggleRatingApplianceMutation.isLoading && <Spinner className='pl-4' size='small' />
                                                }
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        }
                        {
                            data?.feedback &&
                            <div className='flex flex-col pt-8'>
                                <div className='subtitle pb-2 border-b'>{t('patient_ratings.patient_comment')}</div>
                                <div className='body2 pt-4 whitespace-pre-line'>
                                    {data.feedback}
                                </div>
                            </div>
                        }
                    </>
            }
        </div>
    )
}

export default PatientRatingsPopup;