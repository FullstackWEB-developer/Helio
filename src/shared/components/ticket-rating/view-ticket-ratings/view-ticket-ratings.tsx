import {ChannelTypes} from '@shared/models';
import './view-ticket-ratings.scss';
import {useTranslation} from 'react-i18next';
import React, {useRef, useState} from 'react';
import SvgIcon, {Icon} from '@components/svg-icon';
import {Ticket} from '@pages/tickets/models/ticket';
import {Patient} from '@pages/patients/models/patient';
import {useQuery} from 'react-query';
import {GetPatient, GetReviewsByTicketId, GetTicketByNumber} from '@constants/react-query-constants';
import {getTicketByNumber, getTicketReviews} from '@pages/tickets/services/tickets.service';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {TranscriptReviewHeader} from '@components/ticket-rating';
import Spinner from '@components/spinner/Spinner';
import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';
import ViewSingleTicketReview from '@components/ticket-rating/view-ticket-ratings/view-single-ticket-review';
import ViewTicketRatingsModalWrapper
    from '@components/ticket-rating/view-ticket-ratings/view-ticket-ratings-modal-wrapper';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import dayjs from 'dayjs';
import {useReactToPrint} from 'react-to-print';
export interface ViewTicketRatingsProps {
    ticketNumber?: number;
    ticketInput?: Ticket;
    patientInput?: Patient;
    isOpen: boolean;
    onClose?: () => void;
}
const ViewTicketRatings = ({ticketNumber, patientInput, ticketInput, isOpen, onClose}: ViewTicketRatingsProps) => {
    const {t} = useTranslation();
    const [open, setOpen] = useState(isOpen);
    const [ticket, setTicket] = useState<Ticket | undefined>(ticketInput);
    const [patient, setPatient] = useState<Patient | undefined>(patientInput);
    const dispatch = useDispatch();
    const ratingsDiv = useRef<HTMLDivElement>(null);
    const closeModal = () => {
        setOpen(false);
        if(onClose) {
            onClose();
        }
    }

    const {isLoading: isTicketLoading, isError: isTicketError} =useQuery([GetTicketByNumber, ticketNumber], () => getTicketByNumber(ticketNumber!!), {
        enabled: !ticket && !!ticketNumber,
        onSuccess: (data) =>{
            setTicket(data);
        }
    });

    const {isLoading: isPatientLoading, isError: isPatientError} = useQuery([GetPatient, ticket?.patientId],
        () => getPatientByIdWithQuery(ticket?.patientId!!), {
        enabled: !patient && !!ticket?.patientId,
        onSuccess: (patient) => setPatient(patient)
    });

    const {isLoading: isReviewsLoading, data: reviews} = useQuery([GetReviewsByTicketId, ticket?.id], () => getTicketReviews(ticket?.id!), {
        enabled: !!ticket?.id
    });

    const print = useReactToPrint({
        content: () => ratingsDiv.current,
        bodyClass:'pl-8',
        documentTitle: t('ticket_log.reviews_print_title', { ticketNumber: ticketNumber})
    });

    const download = () => {
        if (!reviews || reviews.length === 0) {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Info,
                message: 'ticket_log.no_review_to_download'
            }));
        }

        let output = '';
        const newLine = "\r\n";
        const twoEmptyLines = "\r\n\r\n";

        reviews?.forEach((review: TicketManagerReview) => {
            output += t('ticket_log.download_review_created_line', {
                reviewed_by: review.createdByName,
                date: dayjs.utc(review.createdOn).local().format('MMM D, YYYY h:mm A')
            });
            output += `${newLine}`;
            output += t('ticket_log.download_review_feedback_line', {
                feedback: review.feedback,
            });
            output += `${newLine}`;
            output += t('ticket_log.download_review_rating_line', {
                rating: review.rating,
            });
            output += twoEmptyLines;
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(
            new Blob([output], { type: 'text/plain' })
        );
        link.download = `${ticketNumber ?? ticket?.ticketNumber}_ticket_reviews.txt`;
        link.click();
    }


    if (isTicketLoading || isPatientLoading || isReviewsLoading) {
        return <ViewTicketRatingsModalWrapper closeModal={closeModal} isOpen={open}>
                <Spinner fullScreen={true} />
            </ViewTicketRatingsModalWrapper>
    }

    if (isPatientError || isTicketError) {
        return <ViewTicketRatingsModalWrapper closeModal={closeModal} isOpen={open}>
            <div>{t('ticket_log.error_loading_data')}</div>
        </ViewTicketRatingsModalWrapper>
    }

    return <ViewTicketRatingsModalWrapper ref={ratingsDiv} closeModal={closeModal} isOpen={open}>
            <div className='border-b flex flex-row justify-between'>
                <div className='subtitle pb-2 pt-4'>{t(ticket?.channel === ChannelTypes.Chat ?  'ticket_log.chat_info' : 'ticket_log.call_info')}</div>
                <div className='flex flex-row space-x-4 pt-4'>
                    <span className='cursor-pointer'>
                        <SvgIcon type={Icon.Print} fillClass='rgba-062-fill' onClick={print}/>
                    </span>
                    <span className='cursor-pointer'>
                        <SvgIcon type={Icon.Download} fillClass='rgba-062-fill' onClick={() => download()}/>
                    </span>
                </div>
            </div>
            <div className='pb-5'>
                {isPatientError || isTicketError ?  <div>{t('ticket_log.error_loading_data')}</div> : <TranscriptReviewHeader ticket={ticket!} patient={patient} />}
            </div>
            <div className='pb-2 border-b subtitle'>
                {t('ticket_log.manager_review')}
            </div>
            <div className='overflow-y-auto print:overflow-visible'>
                {reviews?.map((review: TicketManagerReview, index) => <>
                    <div className="page-break" />
                    <ViewSingleTicketReview ticket={ticket!} hasTopBorder={index > 0} key={review.id} review={review} />
                </>)}
            </div>
    </ViewTicketRatingsModalWrapper>
}

export default ViewTicketRatings;
