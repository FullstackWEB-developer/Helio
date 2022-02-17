import React, {useEffect, useMemo, useState} from 'react';
import {useComponentVisibility} from '@shared/hooks';
import SvgIcon, {Icon} from '@components/svg-icon';
import './conversation-header-popup.scss';
import Button from '@components/button/button';
import utils from '@shared/utils/utils';
import {useHistory} from 'react-router';
import {ContactsPath, PatientsPath} from '@app/paths';
import {usePopper} from 'react-popper';
import classnames from 'classnames';
import {ContactExtended} from '@shared/models';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import ConversationHeaderPatientDetails from './conversation-header-patient-details';
import ConversationHeaderQuickActionsStripe from './conversation-header-quick-actions-stripe';
import ConversationHeaderContactDetails from './conversation-header-contact-details';
import {useDispatch} from 'react-redux';
import {getLookupValues} from '@pages/tickets/services/tickets.service';
import {ContactType} from '@pages/contacts/models/ContactType';
import {useTranslation} from 'react-i18next';

interface ConversationHeaderPopup {
    anonymous: boolean;
    name: string;
    photo: JSX.Element;
    patient?: ExtendedPatient;
    contact?: ContactExtended;
}
const ConversationHeaderPopup = ({anonymous, name, photo, patient, contact}: ConversationHeaderPopup) => {
    const history = useHistory();
    const {t} = useTranslation();
    const redirectToAthena = () => {window.open(utils.getAppParameter('AthenaHealthUrl'), '_blank')};
    const redirectToContactScreen = () => {history.push(ContactsPath, {email: name})};
    const redirectToPatientChart = (id: number) => {history.push(`${PatientsPath}/${id}`)};
    const redirectToContactDetails = (id: string) => {history.push(`${ContactsPath}/${id}`)};
    const dispatch = useDispatch();
    const renderActions = () => {
        if (anonymous) {
            return (
                <>
                    <Button label='email.inbox.create_patient_chart' onClick={redirectToAthena} />
                    <Button label='email.inbox.add_contact' className='ml-6' onClick={redirectToContactScreen} />
                </>
            );
        }
        if (patient?.patientId) {
            return <Button label='email.inbox.view_patient_chart' onClick={() => redirectToPatientChart(patient.patientId)} />
        }
        if (contact?.id) {
            return <Button label='email.inbox.view_contact_details' onClick={() => redirectToContactDetails(contact.id!)} />
        }
    }

    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const {styles, attributes, update} = usePopper(elementRef.current, popper, {
        placement: 'bottom',
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [80, 0],
            },
        }]
    });

    useEffect(() => {
        if (isVisible && update) {
            update().then();
        }
    }, [update, isVisible]);

    useEffect(() => {
        dispatch(getLookupValues('ContactCategory'));
    }, [dispatch]);

    const description = useMemo(() => {
        if (contact) {
            if (contact.type === ContactType.Individual) {
                if (!!contact.companyName) {
                    return t('contacts.contact_details.individual.title_at_company', {
                        title: contact.jobTitle,
                        company: contact.companyName
                    });
                } else {
                    return contact.jobTitle;
                }
            }
        }
    }, [contact]);

    return (
        <div ref={elementRef}>
            <div className='cursor-pointer' onClick={() => setIsVisible(!isVisible)}>
                <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp}
                    fillClass='rgba-062-fill' />
            </div>
            <div className={classnames('z-10 conversation-popup mt-3', {'hidden': !isVisible})} style={styles.popper}
                ref={setPopper}{...attributes.popper}>
                <div className='conversation-popup-width'>
                    <div className={classnames('px-4 flex items-center', {'py-6': anonymous, 'pt-6': !anonymous})}>
                        {photo}
                        <div className='flex flex-col pl-4'>
                            <h6>{name}</h6>
                            {
                                !!description && <span className='body2 conversation-popup-contact-job-title'>{description}</span>
                            }
                        </div>
                    </div>
                    {
                        !anonymous && <div className='pl-16 pb-3'><ConversationHeaderQuickActionsStripe patient={patient} contact={contact} /></div>
                    }
                    <div className='conversation-popup-divider h-px'></div>
                    {
                        patient && <ConversationHeaderPatientDetails patient={patient} />
                    }
                    {
                        contact && <ConversationHeaderContactDetails contact={contact} />
                    }
                    <div className='flex conversation-popup-actions px-4 pt-6 pb-8'>
                        {
                            renderActions()
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationHeaderPopup;
