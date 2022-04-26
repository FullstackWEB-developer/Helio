import React, {useState} from "react";
import {Patient} from '@pages/patients/models/patient';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import SmsNewMessageNewTicketForm from './sms-new-message-new-ticket-form';
import {useTranslation} from 'react-i18next';
import Button from '@components/button/button';
import {useDispatch, useSelector} from "react-redux";
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {createTicket} from '@pages/tickets/services/tickets.service';
import {useMutation} from 'react-query';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {Ticket} from '@pages/tickets/models/ticket';
import {ChannelTypes, ContactExtended, TicketType} from '@shared/models';
import utils from "@shared/utils/utils";
import {ContactType} from "@pages/contacts/models/ContactType";

interface SmsNewMessageNewTicketProps {
    patient?: Patient;
    contact?: ContactExtended;
    onClick?: (ticket: TicketBase) => void;
    onCancelClick?: () => void;
    type: ChannelTypes.SMS | ChannelTypes.Email;
}

const SmsNewMessageNewTicket = ({patient, contact, type, ...props}: SmsNewMessageNewTicketProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const auth = useSelector(authenticationSelector);
    const [ticketTypeSelected, setTicketTypeSelected] = useState<TicketType>();
    const [ticketReasonSelected, setTicketReasonSelected] = useState<string>();
    const [isValid, setValid] = useState(false);

    const createTicketMutation = useMutation(createTicket, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('tickets.ticket_created', {ticketNumber: data.ticketNumber})
            }));
            if (props.onClick) {
                props.onClick(data as TicketBase);
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('tickets.ticket_creation_failed')
            }));
        }
    });
    const onClick = () => {
        if (ticketTypeSelected) {
            const newTicket: Ticket = {
                type: ticketTypeSelected,
                reason: ticketReasonSelected,
                channel: type,
                assignee: auth.id,
            };

            if (!!patient) {
                newTicket.patientId = patient.patientId;
                newTicket.createdForName = utils.stringJoin(' ', patient.firstName, patient.lastName);
                newTicket.originationNumber = patient.mobilePhone
            }

            if (!!contact) {
                newTicket.contactId = contact.id;
                newTicket.createdForName = contact.type === ContactType.Individual ?
                    utils.stringJoin(' ', contact.firstName, contact.lastName) :
                    contact.companyName;
                newTicket.originationNumber = contact.mobilePhone
            }

            createTicketMutation.mutate(newTicket);
        }
    }
    return (
        <div className='px-6 pb-7'>
            <h6 className='my-7'>{t(type === ChannelTypes.SMS ? 'sms.chat.new.new_ticket.title' : 'email.new_email.new_ticket.title')}</h6>
            <SmsNewMessageNewTicketForm
                disabled={createTicketMutation.isLoading}
                onTicketReasonChange={value => setTicketReasonSelected(value)}
                onTicketTypeChange={value => setTicketTypeSelected(value)}
                onValidate={v => setValid(v)}
            />

            <div className='mt-11 flex flex-row'>
                <Button
                    data-test-id='new-message-cancel-ticket-button'
                    type='button'
                    buttonType='secondary-medium'
                    className='mr-8'
                    label='common.cancel'
                    disabled={createTicketMutation.isLoading}
                    onClick={() => props.onCancelClick && props.onCancelClick()}
                />

                <Button
                    isLoading={createTicketMutation.isLoading}
                    buttonType='medium'
                    className='uppercase'
                    disabled={!isValid}
                    data-test-id='new-message-select-ticket-button'
                    label='common.ok'
                    onClick={onClick}
                />
            </div>

        </div>
    );
}

export default SmsNewMessageNewTicket;
