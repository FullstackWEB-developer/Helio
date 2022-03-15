import Modal from '@components/modal/modal';
import PatientRatingsPopup from '@components/patient-ratings-popup/patient-ratings-popup';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {PatientRating} from '@pages/tickets/models/patient-rating.model';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const TicketDetailRating = ({botRating, patientRating, ticketId}: {botRating?: number, patientRating?: PatientRating, ticketId: string}) => {
    const {t} = useTranslation();
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const displayBotRating = () => {
        switch (botRating) {
            case -1:
                return <SvgIcon
                    fillClass='icon-medium rating-widget-unsatisfied'
                    type={Icon.RatingDissatisfied} />;
            case 1:
                return <SvgIcon
                    fillClass='icon-medium rating-widget-satisfied'
                    type={Icon.RatingVerySatisfied} />;
            case 0:
                return <SvgIcon
                    fillClass='icon-medium rating-widget-neutral'
                    type={Icon.RatingSatisfied} />;
            default:
                return null;
        }
    }

    const displayPatientRating = () => {
        switch (patientRating?.rating) {
            case -1:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-unsatisfied'
                    wrapperClassName='cursor-pointer'
                    type={patientRating.feedback ? Icon.RatingDissatisfiedComment : Icon.RatingDissatisfied} />;
            case 1:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-satisfied'
                    wrapperClassName='cursor-pointer'
                    type={patientRating.feedback ? Icon.RatingVerySatisfiedComment : Icon.RatingVerySatisfied} />;
            case 0:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-neutral'
                    wrapperClassName='cursor-pointer'
                    type={patientRating.feedback ? Icon.RatingSatisfiedComment : Icon.RatingSatisfied} />;
            default:
                return null;
        }
    }

    return (
        <>
            {(botRating || botRating === 0) && displayBotRating()}
            {patientRating && displayPatientRating()}
            <Modal isDraggable={true} isOpen={ratingModalOpen} title={t('patient_ratings.title_singular')} onClose={() => setRatingModalOpen(false)}
                isClosable={true} closeableOnEscapeKeyPress={ratingModalOpen} >
                <PatientRatingsPopup ticketId={ticketId} />
            </Modal >
        </>
    );
}

export default TicketDetailRating;
