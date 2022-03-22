import React, { useEffect, useState } from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {useMutation} from 'react-query';
import './feedback.scss';
import Button from '@components/button/button';
import TextArea from '../../../shared/components/textarea/textarea';
import SvgIcon, {Icon} from '@components/svg-icon';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { SnackbarPosition } from '@components/snackbar/snackbar-position.enum';
import { creteFeedback } from '@pages/tickets/services/tickets.service';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import utils from '@shared/utils/utils';
import { FeedbackResponse } from '@pages/tickets/models/feedback-response';
import FeedbackRatingOptions from './components/feeedback-rating-options';
const Feedback = () => {

    const {t} = useTranslation();
    const [selectedReview, setSelectedReview] = useState<number>();
    const {ticketId} = useParams<{ticketId: string}>();
    const {ratingOption} = useParams<{ratingOption: string}>();
    const [reviewMessage, setReviewMessage] = useState<string>("");
    const [isReviewSend, setIsReviewSend] = useState<boolean>(false);
    const [feedbackResponse, setFeedbackResponse] = useState<FeedbackResponse>();
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (ratingOption && Number(ratingOption) >= -1 && Number(ratingOption) <= 1) {
            setSelectedReview(Number(ratingOption));
        }
    }, [ratingOption]);

    const getIsSelected = (id:number) => {
        return (selectedReview == id) && ' feedback-selected'
    }

    const sendReview = () => {
        if(selectedReview != undefined){
            createReview.mutate({
                ticketId: ticketId,
                isApplied: true,
                rating: selectedReview,
                feedback: reviewMessage.replace(/^\s+|\s+$/g, '')
            });
        }
    }

    const redirect = (url) => {
        window.location.replace(url)
    }

    const createReview = useMutation(creteFeedback, {
        onSuccess: (response) => {
            setFeedbackResponse(response);
            setIsReviewSend(true);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.feedbacks.result_failed',
                position: SnackbarPosition.TopCenter
            }));
        }
    });
    
    if(!utils.isGuid(ticketId)){
        return <div>{t('external_access.not_verified_link')}</div>;
    }

    if (isReviewSend) {
        return <div className={'feedback-body w-full h-full'} >
            <h4 className='mb-10'>{t('external_access.feedbacks.result_title')}</h4>
            <div className="flex flex-col body2 w-full">
                <div className='mb-9 w-full'>
                    <span className='body2-primary'>{`${t('external_access.feedbacks.result_paragraph_1')} `}</span>
                </div>
                {(feedbackResponse?.name && feedbackResponse.url) && (
                    <div>
                        <div className='mb-6 w-full'>
                            <span className='subtitle'>{`${t('external_access.feedbacks.result_paragraph_2')} ${feedbackResponse.name} ${t('external_access.feedbacks.result_paragraph_3')} `}</span>
                        </div>
                        <div className='mb-4 w-full'>
                            <Button
                                label={`${t('external_access.feedbacks.feedback_button')} ${feedbackResponse.name}`}
                                className='w-full md:w-auto'
                                type='submit'
                                data-test-id='submit-button'
                                buttonType='big'
                                onClick={() => redirect(feedbackResponse.url)} />
                        </div>
                    </div>
                )}
                
            </div>
        </div>;
    }

    return <div className={'feedback-body w-full h-full'} >
        <h4 className='mb-10'>{t('external_access.feedbacks.title')}</h4>
        <div className="flex flex-col body2 w-full">
            <div className='mb-9 w-full'>
                <span className='subtitle'>{`${t('external_access.feedbacks.paragraph_1')}`}</span>
            </div>
            <div className='mb-9 w-full'>
                <div className="flex">
                    <FeedbackRatingOptions id={-1} fillClass={'unsatify-color'} icon={Icon.RatingDissatisfied} text={t('external_access.feedbacks.unsatisfied')} wrapperClassNames={'mr-6'} selectedReview={selectedReview} setSelectedReview={setSelectedReview} />
                    <FeedbackRatingOptions id={0} fillClass={'warning-icon'} icon={Icon.RatingSatisfied} text={t('external_access.feedbacks.satisfied')} wrapperClassNames={'mr-6'} selectedReview={selectedReview} setSelectedReview={setSelectedReview} />
                    <FeedbackRatingOptions id={1} fillClass={'success-icon'} icon={Icon.RatingVerySatisfied} text={t('external_access.feedbacks.very_satisfied')} selectedReview={selectedReview} setSelectedReview={setSelectedReview} />
                </div>
            </div>
            <div className='mb-4 w-full'>
                <span className='subtitle'>{`${t('external_access.feedbacks.paragraph_2')}`}</span>
            </div>
            <div className='mb-4 w-full'>
                <TextArea
                    className='h-full pb-0 pr-0 body2 w-full'
                    textareaContainerClasses='pl-4 h-full w-full rounded'
                    data-test-id='note-context-notes'
                    placeHolder={t('external_access.feedbacks.enter_your_message')}
                    required={true}
                    overwriteDefaultContainerClasses={true}
                    rows={4}
                    resizable={false}
                    hasBorder={true}
                    iconClassNames='icon-medium'
                    iconFill='notes-send'
                    maxLength={4000}
                    onChange={(e) => setReviewMessage(e)}
                />
            </div>
            <div className='mb-4 w-full'>
                <span className='body3-medium'>{`${t('external_access.feedbacks.warning')}`}</span>
            </div>
            <div className='mb-4 w-full'>
                <Button
                    label={'external_access.feedbacks.submit'}
                    className='w-full md:w-auto'
                    disabled={selectedReview == undefined}
                    isLoading={createReview.isLoading}
                    type='submit'
                    data-test-id='submit-button'
                    buttonType='big'
                    onClick={() => sendReview()} />
            </div>
        </div>
        
    </div>
}

export default withErrorLogging(Feedback);