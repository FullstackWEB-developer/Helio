import {useLocation} from 'react-router';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setVerificationCodeChannel} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import RadioSingle from '@components/radio-single';
import './get-external-user-select-channel.scss';
import Button from '@components/button/button';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';

const GetExternalUserSelectChannel = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const request = useSelector(selectRedirectLink);
    const location = useLocation<{email?: string, mobileNumber?: string, isVerified: boolean}>();
    const [error, setError] = useState<string>('');
    const history = useHistory();
    const [selectedChannel, setSelectedChannel] = useState<VerificationType>(VerificationType.Sms);

    useEffect(() => {
        const state = location?.state;
        let channel: VerificationType | undefined = undefined;
        if (!!state?.email && !state?.mobileNumber) {
            channel = VerificationType.Email;
        } else if (!state?.email && !!state?.mobileNumber) {
            channel = VerificationType.Sms;
        } else if (!state?.email && !state?.mobileNumber) {
            setError('external_access.no_email_no_mobile');
        }

        if (!!channel) {
            channelSelected(channel);
        }
    }, [location?.state]);


    if (!!error) {
        return <div> {t(error)} </div>
    }

    const onChannelSelect = (value: VerificationType) =>{
        setSelectedChannel(value);
    }

    const channelSelected = (channel: VerificationType) => {
        dispatch(setVerificationCodeChannel(channel));
        history.push('/o/verify-patient-code');
    }

    return <div className='pt-4 md:px-12 xl:px-48 without-default-padding xl:pt-16'>
        <GetExternalUserHeader
            title={`external_access.title_${request.requestType}`}
            description={t('external_access.select_channel_description')} />
        <div>
                <div className='pb-6'>
                    <RadioSingle
                        value='sms'
                        object={VerificationType.Sms}
                        label={'external_access.send_verification_via_mobile'}
                        name={'verificationChannel'}
                        defaultChecked={true}
                        checked={selectedChannel === VerificationType.Sms}
                        className='flex flex-row space-x-8'
                        onChange={(value, obj: VerificationType) => onChannelSelect(obj)}
                    />
                    <div className='body2 channel-selection-radio-description '>
                        {location.state.mobileNumber}
                    </div>
                </div>
                <div className='flex justify-start pb-2 flex-col'>
                    <RadioSingle
                        value='email'
                        defaultChecked={false}
                        object={VerificationType.Email}
                        label='external_access.send_verification_via_email'
                        name={'verificationChannel'}
                        checked={selectedChannel === VerificationType.Email}
                        className='flex flex-row space-x-8'
                        onChange={(value, obj: VerificationType) => onChannelSelect(obj)}
                    />
                    <div className='body2 channel-selection-radio-description '>
                        {location.state.email}
                    </div>
                </div>
            <div className='pb-2 flex justify-start pt-10'>
                <div>
                    <Button
                        label={'common.continue'}
                        disabled={!selectedChannel}
                        className='w-full md:w-auto'
                        type='submit'
                        onClick={() => channelSelected(selectedChannel)}
                        data-test-id='select-channel-submit-button'
                        buttonType='big' />
                </div>
            </div>
        </div>
        <ExternalUserEmergencyNote type={request.requestType} />
    </div>
}

export default GetExternalUserSelectChannel;
