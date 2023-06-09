import Button from '@components/button/button';
import Pagination from '@components/pagination/pagination';
import RadioSingle from '@components/radio-single';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {Patient} from '@pages/patients/models/patient';
import {Ticket} from '@pages/tickets/models/ticket';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {createTicket} from '@pages/tickets/services/tickets.service';
import {ChannelTypes, ContactExtended, ContactType, PagedList, Paging, TicketType} from '@shared/models';
import {userNameSelector} from '@shared/store/app-user/appuser.selectors';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import utils from '@shared/utils/utils';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import SmsNewMessageExistingTicketList from './sms-new-message-existing-ticket-list';
import SmsNewMessageNewTicketForm from './sms-new-message-new-ticket-form';
import Spinner from '@components/spinner/Spinner';
import {NEW_MESSAGE_OPTION_CREATE_TICKET, NEW_MESSAGE_OPTION_SELECT_TICKET} from '@pages/sms/constants';
import {setEmailNewTicketId} from '@pages/email/store/email-slice';

interface SmsNewMessageExistingTicketProps {
    tickets: PagedList<TicketBase>,
    onTicketsPageChange?: (paging: Paging) => void;
    patient?: Patient;
    contact?: ContactExtended;
    onClick?: (ticket: TicketBase) => void;
    onCancelClick?: () => void;
    type: ChannelTypes.SMS | ChannelTypes.Email;
}

const SmsNewMessageExistingTicket = ({tickets, patient, contact, ...props}: SmsNewMessageExistingTicketProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const username = useSelector(userNameSelector);

    const [isTicketListVisible, setTicketListVisible] = useState(true);
    const [ticketTypeSelected, setTicketTypeSelected] = useState<TicketType>();
    const [ticketReasonSelected, setTicketReasonSelected] = useState<string>();
    const [isValid, setValid] = useState(false);
    const [isNewTicketVisible, setNewTicketVisible] = useState(false);
    const [ticket, setTicket] = useState<TicketBase>();

    const onRadioTicketListChanged = () => {
        setNewTicketVisible(false);
        setTicketListVisible(true);
        setValid(false);
    }

    const onRadioNewTicketChanged = () => {
        setNewTicketVisible(true);
        setTicketListVisible(false);
        setValid(false);
    }

    const onSelectTicket = (value: TicketBase) => {
        setTicket(value);
        setValid(true);
    }

    const getPaging = (): Paging => {
        const {results, ...paging} = tickets;
        return paging;
    }

    const createTicketMutation = useMutation(createTicket, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('tickets.ticket_created', {ticketNumber: data.ticketNumber})
            }));
            if (props.onClick) {
                props.onClick(data as TicketBase);
            }
            dispatch(setEmailNewTicketId(data.id));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('tickets.ticket_creation_failed')
            }));
        }
    });

    const onClick = () => {
        if (isTicketListVisible && ticket && props.onClick) {
            props.onClick(ticket);
        }

        if (isNewTicketVisible && ticketTypeSelected) {
            const newTicket: Ticket = {
                type: ticketTypeSelected,
                reason: ticketReasonSelected,
                channel: props.type,
                assignee: username
            };

            if (!!patient) {
                newTicket.patientId = patient.patientId;
                newTicket.createdForName = utils.stringJoin(' ', patient.firstName, patient.lastName);
                if (props.type === ChannelTypes.SMS) {
                    newTicket.originationNumber = patient.mobilePhone
                }

            }

            if (!!contact) {
                newTicket.contactId = contact.id;
                newTicket.createdForName = contact.type === ContactType.Individual ?
                    utils.stringJoin(' ', contact.firstName, contact.lastName) :
                    contact.companyName;
                if (props.type === ChannelTypes.SMS) {
                    newTicket.originationNumber = contact.mobilePhone
                }
            }

            createTicketMutation.mutate(newTicket);
        }
    }
    if (createTicketMutation.isLoading) {
        return <Spinner />
    }
    return (
        <div className='px-6 pb-7'>
            <div className='flex flex-col justify-between my-7'>
                <h6 className='mb-5'>{t('sms.chat.new.existing_ticket.title')}</h6>
                <p className='body2'>{patient ? t('sms.chat.new.existing_ticket.description') : t('sms.chat.new.existing_ticket.description_contact')}</p>
            </div>
            <div>
                <RadioSingle
                    label={t('sms.chat.new.existing_ticket.select_ticket')}
                    name='new-message-option'
                    defaultChecked
                    value={NEW_MESSAGE_OPTION_SELECT_TICKET}
                    truncate
                    onChange={onRadioTicketListChanged}
                />
                {isTicketListVisible &&
                    <div className='flex flex-col'>
                        <div className='flex flex-row justify-end w-full mb-6'>
                            <Pagination
                                value={getPaging()}
                                onChange={props.onTicketsPageChange}
                            />
                        </div>
                        <SmsNewMessageExistingTicketList
                            items={tickets.results}
                            onChange={onSelectTicket}
                        />
                    </div>
                }
                <RadioSingle
                    label={t('sms.chat.new.existing_ticket.create_ticket')}
                    name='new-message-option'
                    value={NEW_MESSAGE_OPTION_CREATE_TICKET}
                    truncate
                    onChange={onRadioNewTicketChanged}
                />
                {isNewTicketVisible &&
                    <SmsNewMessageNewTicketForm
                        onTicketReasonChange={value => setTicketReasonSelected(value)}
                        onTicketTypeChange={value => setTicketTypeSelected(value)}
                        onValidate={v => setValid(v)}
                    />
                }

                <div className='mt-11'>
                    <Button
                        data-test-id='new-message-cancel-ticket-button'
                        type='button'
                        className='mr-8'
                        buttonType='secondary-medium'
                        label='common.cancel'
                        onClick={() => props.onCancelClick && props.onCancelClick()}
                    />
                    <Button
                        buttonType='medium'
                        disabled={!isValid}
                        className='uppercase'
                        data-test-id='new-message-select-ticket-button'
                        label='common.ok'
                        onClick={onClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default SmsNewMessageExistingTicket;
