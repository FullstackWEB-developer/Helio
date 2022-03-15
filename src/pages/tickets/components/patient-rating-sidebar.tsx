import React, {useMemo, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {Ticket} from '../models/ticket';
import SvgIcon, {Icon} from '@components/svg-icon';
import Modal from '@components/modal/modal';
import PatientRatingsPopup from '@components/patient-ratings-popup/patient-ratings-popup';

const PatientRatingSideBar = ({ticket}: {ticket: Ticket}) => {
    const {t} = useTranslation();
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const displayRatingIcon = useMemo(() => {
        switch (ticket?.patientRating?.rating) {
            case -1:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-unsatisfied'
                    wrapperClassName='cursor-pointer'
                    type={ticket.patientRating.feedback ? Icon.RatingDissatisfiedComment: Icon.RatingDissatisfied} />;
            case 1:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-satisfied'
                    wrapperClassName='cursor-pointer'
                    type={ticket.patientRating.feedback ? Icon.RatingVerySatisfiedComment: Icon.RatingVerySatisfied} />;
            case 0:
                return <SvgIcon
                    onClick={() => setRatingModalOpen(!ratingModalOpen)}
                    className='icon-medium'
                    fillClass='rating-widget-neutral'
                    wrapperClassName='cursor-pointer'
                    type={ticket.patientRating.feedback ? Icon.RatingSatisfiedComment: Icon.RatingSatisfied} />;
            default:
                return null;
        }
    }, [ticket, ratingModalOpen]);

    return (
        displayRatingIcon &&
        <div className='flex flex-col pb-4'>
            <div className='h8 pb-4'>{t('patient_ratings.title_plural')}</div>
            <div className='flex body2-medium'>
                {ticket?.patientRating?.createdOn && dayjs.utc(ticket?.patientRating.createdOn).local().format('MMM D, YYYY h:mm A')}
            </div>
            <div className='flex'>
                {displayRatingIcon}
                {
                    ticket?.createdForName &&
                    <div className='pl-4 body2-medium'>
                        <Trans i18nKey="patient_ratings.rating_by" values={{name: ticket.createdForName}}>
                            <span className='body2'>{ticket.createdForName}</span>
                        </Trans>
                    </div>
                }
            </div>
            <Modal isDraggable={true} isOpen={ratingModalOpen} title={t('patient_ratings.title_singular')} onClose={() => setRatingModalOpen(false)}
                isClosable={true} closeableOnEscapeKeyPress={ratingModalOpen}>
                <PatientRatingsPopup ticketId={ticket.id!} />
            </Modal>
        </div>
    )
}

export default PatientRatingSideBar;