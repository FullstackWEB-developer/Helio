import Modal from '@components/modal/modal';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Rating from '@components/rating/rating';
import TextArea from '@components/textarea/textarea';
import './add-ticket-rating.scss';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {creteTicketFeedback} from '@pages/tickets/services/tickets.service';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

export interface AddTicketReviewProps {
    ticketId: string;
    onClose?: () => void;
    isOpen: boolean;
    onAdded?: () => void;
}
const AddTicketReview = ({ticketId, onClose, isOpen, onAdded} : AddTicketReviewProps) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(isOpen);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const dispatch = useDispatch();

    const createReviewMutation = useMutation(creteTicketFeedback, {
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message:'ticket_log.error_adding_feedback'
            }))
        },
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message:'ticket_log.success_adding_feedback'
            }));
            if (onAdded) {
                onAdded()
            }
            closeModal();
        }
    })

    const closeModal = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const addReview = () => {
        createReviewMutation.mutate({
            ticketId,
            rating,
            feedback : feedback.replace(/^\s+|\s+$/g, '')
        });
    }

    return <Modal isDraggable={true} isOpen={open} title='ticket_log.add_rating_review' isClosable={true} onClose={() => closeModal()}>
        <div className='flex flex-col add-ticket-rating-modal relative'>
            <div className='subtitle pt-6'>{t('ticket_log.overall_rating')}</div>
            <div className='pt-6'>
                <Rating size='large' value={rating} onClick={(value: number) => setRating(value)} />
            </div>
            <div className='subtitle pt-8'>{t('ticket_log.add_rating_comment')}</div>
            <div>
                <TextArea placeHolder='ticket_log.add_rating_comment_placeholder'
                          value={feedback}
                          maxRows={2}
                          className='pb-11 pr-8 body2 w-full h-full'
                          resizable={false}
                          onChange={(value) => setFeedback(value)}/>
            </div>
            <div className='flex flex-row bottom absolute bottom-6 right-2'>
                <Button className='mr-6'
                        label='common.cancel'
                        disabled={createReviewMutation.isLoading}
                        buttonType='secondary'
                        onClick={() => closeModal()}/>
                <Button label='ticket_log.add_review'
                        buttonType='small'
                        isLoading={createReviewMutation.isLoading}
                        disabled={rating === 0}
                        onClick={() => addReview()}/>
            </div>
        </div>
    </Modal>
}

export default AddTicketReview;
