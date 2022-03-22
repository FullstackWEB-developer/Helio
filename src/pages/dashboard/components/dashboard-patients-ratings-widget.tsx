import {PatientRatings} from '@pages/dashboard/models/patient-ratings.model';
import {useTranslation} from 'react-i18next';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import StatusDot from '@components/status-dot/status-dot';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import './ratings-widget.scss';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { SnackbarPosition } from '@components/snackbar/snackbar-position.enum';
import { getOverallPatientReviews } from '@pages/tickets/services/tickets.service';
import { DashboardTypes } from '../enums/dashboard-type.enum';
import { useDispatch } from 'react-redux';
import { GetPatientRatings } from '@constants/react-query-constants';
import classNames from 'classnames';

export interface PatientRatingsProps {
    data?: PatientRatings;
}

const DashboardPatientRatingsWidget = ({data}: PatientRatingsProps) => {
    const [patientData, setPatientData] = useState<PatientRatings | undefined>(data);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useQuery([GetPatientRatings, DashboardTypes.my], () => getOverallPatientReviews(DashboardTypes.my),
    {
        onSuccess: (response) => {
            if(response)
                setPatientData(response);
            else{
                setPatientData({
                    unsatisfiedPercent: 0,
                    unsatisfiedCount: 0,
                    neutralPercent: 0,
                    neutralCount: 0,
                    satisfiedPercent: 0,
                    satisfiedCount: 0,
                    overallSatisfiedPercent: 0
                })
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.feedbacks.result_failed',
                position: SnackbarPosition.TopCenter
            }));
        },
        enabled: !data
    });
        
    useEffect(() => {
        if(!!data){
            setPatientData(data);
        }
    }, [data]);

    const WidgetIcon = () => {
        if (!patientData || patientData.overallSatisfiedPercent === 0 || patientData.overallSatisfiedPercent === 50) {
            return <SvgIcon
                fillClass='icon-medium'
                type={Icon.RatingSatisfied}/>
        }
        return <SvgIcon
            fillClass={classNames('icon-medium', {
                'rating-widget-satisfied': patientData.overallSatisfiedPercent > 50,
                'rating-widget-unsatisfied': patientData.overallSatisfiedPercent <= 50
            })}
            type={patientData.overallSatisfiedPercent > 50 ? Icon.RatingVerySatisfied : Icon.RatingDissatisfied}/>
    }

    const calculateOverall = () => {
        if(patientData){
            if (patientData.overallSatisfiedPercent < 0) {
                return 0;
            }
            return patientData.overallSatisfiedPercent;
        }
    }

    return <div className='flex flex-col items-center justify-center pt-2.5'>
        <div className='body3 patient-title'>{t('dashboard.patient_ratings.overall_ratings')}</div>
        <div>
            <div className='flex flex-row items-center justify-center pb-10'>
                <WidgetIcon/>
                <div className='pl-2.5'><h3>{calculateOverall()}%</h3></div>
            </div>
            <div className='flex flex-row items-center body2 pb-2'>
                <div className='pr-2.5'><div className='rounded-lg w-2.5 h-2.5 patient-widget-satisfied'></div></div>
                <div className='w-24'>{t('dashboard.patient_ratings.very_satisfied')}</div>
                <div className='px-6 w-10'>{patientData?.satisfiedCount}</div>
                <div className='pl-6 w-10'>{patientData?.satisfiedPercent}%</div>
            </div>
            <div className='flex flex-row items-center body2 pb-2'>
                <div className='pr-2.5'><div className='rounded-lg w-2.5 h-2.5 patient-widget-neutral'></div></div>
                <div className='w-24'>{t('dashboard.patient_ratings.neutral')}</div>
                <div className='px-6 w-10'>{patientData?.neutralCount}</div>
                <div className='pl-6 w-10'>{patientData?.neutralPercent}%</div>
            </div>
            <div className='flex flex-row items-center body2'>
                <div className='pr-2.5'><div className='rounded-lg w-2.5 h-2.5 patient-widget-unsatisfied'></div></div>
                <div className='w-24'>{t('dashboard.patient_ratings.unsatisfied')}</div>
                <div className='px-6 w-10'>{patientData?.unsatisfiedCount}</div>
                <div className='pl-6 w-10'>{patientData?.unsatisfiedPercent}%</div>
            </div>
        </div>
    </div>
}
export default DashboardPatientRatingsWidget;
