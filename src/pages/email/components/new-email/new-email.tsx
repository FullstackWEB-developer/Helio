import './new-email.scss';
import {useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {QueryContactTickets, QueryTickets, SearchContactResults, SearchPatient} from '@constants/react-query-constants';
import {searchType} from '@components/searchbox/constants/search-type';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getPatients, queryContacts} from '@shared/services/search.service';
import {Patient} from '@pages/patients/models/patient';
import {
    ChannelTypes,
    ContactExtended,
    DefaultPagination,
    PagedList,
    Paging,
    TicketMessageSummary
} from '@shared/models';
import {NewEmailSteps} from '@pages/email/components/new-email/new-email-steps';
import Spinner from '@components/spinner/Spinner';
import NewEmailSearch from '@pages/email/components/new-email/components/new-email-search';
import NewEmailHeader from '@pages/email/components/new-email/components/new-email-header';
import NewEmailNoSearchResult from '@pages/email/components/new-email/components/new-email-no-search-result';
import SearchboxPatientsResults from '@components/searchbox/searchbox-patients-results';
import SearchboxContactsResults from '@components/searchbox/searchbox-contacts-results';
import {getContactTickets, getPatientTicketsPaged} from '@pages/tickets/services/tickets.service';
import {ContactTicketsRequest, PatientTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import SmsNewMessageExistingTicket from '@pages/sms/components/sms-new-message/sms-new-message-existing-ticket';
import {useHistory} from 'react-router-dom';
import {EmailPath} from '@app/paths';
import utils from '@shared/utils/utils';
import {ContactType} from '@pages/contacts/models/ContactType';
import SmsNewMessageNewTicket from '@pages/sms/components/sms-new-message/sms-new-message-new-ticket';
import {useLocation} from 'react-router';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectEmailSummaries} from '@pages/email/store/email.selectors';
import {setMessageSummaries} from '@pages/email/store/email-slice';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {usePrevious} from '@shared/hooks/usePrevious';

const NewEmail = () => {
    const [step, setStep] = useState<NewEmailSteps>(NewEmailSteps.Search);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [contacts, setContacts] = useState<ContactExtended[]>([]);
    const [patientSelected, setPatientSelected] = useState<Patient>();
    const dispatch = useDispatch();
    const [tickets, setTickets] = useState<PagedList<TicketBase>>({...DefaultPagination, results: []});
    const [contactSelected, setContactSelected] = useState<ContactExtended>();
    const [contactPagination, setContactPagination] = useState<Paging>();
    const [toName, setToName] = useState<string>();
    const [searchParams, setSearchParams] = useState<{type: number, value: string}>({type: -1, value: ''});
    const [ticketQueryParams, setTicketQueryParams] = useState<PatientTicketsRequest>({...DefaultPagination, pageSize: 5});
    const [ticketsContactParams, setTicketContactParams] = useState<ContactTicketsRequest>({...DefaultPagination, contactId: ''});
    const history = useHistory();
    const {t} = useTranslation();
    const previousStep = usePrevious(step);
    const location = useLocation<{contact?: ContactExtended, patient?: ExtendedPatient}>();
    const onSearchHandler = (type: number, value: string) => {
        setSearchParams({type, value});
    }
    const messageSummaries = useSelector(selectEmailSummaries);

    const getPatientQueryEnabled = () => !!searchParams.value && (searchParams.type === searchType.patientId || searchParams.type === searchType.patientName);
    const getContactQueryEnabled = () => !!searchParams.value && searchParams.type === searchType.contactName;

    const {isLoading: patientsIsLoading, isFetching: patientsIsFetching, isError: patientIsError} =
        useQuery([SearchPatient, searchParams.type, searchParams.value],
            async () => {
                clearSearchResults();
                if (searchParams.type === searchType.patientId) {
                    return [await getPatientByIdWithQuery(Number(searchParams.value))]
                }

                if (searchParams.type === searchType.patientName) {
                    return await getPatients(searchParams.type, searchParams.value, true);
                }
            }, {
                enabled: getPatientQueryEnabled(),
                onSuccess: (response) => {
                    setPatients(response ?? []);
                },
                onSettled:() => {
                    setStep(NewEmailSteps.PatientSearchResult);
                }
            }
        );

    useEffect(() => {
        if (location?.state?.contact) {
            onContactSelect(location.state.contact);
        }
    }, [location?.state?.contact]);

    useEffect(() => {
        if (location?.state?.patient) {
            onPatientSelect(location.state.patient);
        }
    }, [location?.state?.patient]);

    const {isFetching: contactIsFetching, isLoading: contactIsLoading, isError: contactIsError} =
        useQuery<PagedList<ContactExtended>>([SearchContactResults, searchParams.type, searchParams.value, contactPagination],
            () => {clearSearchResults(); return queryContacts(searchParams.value, contactPagination?.page)}, {
                enabled: getContactQueryEnabled(),
                onSuccess: (response) => {
                    const {results, ...paging} = response;
                    setContacts(results);
                    setStep(NewEmailSteps.ContactSearchResult);
                    setContactPagination({...paging});
                }
            });

    const {refetch: refetchPatientTickets, isFetching: patientTicketsFetching} = useQuery([QueryTickets, ticketQueryParams],
        () => getPatientTicketsPaged(ticketQueryParams), {
            enabled: false,
            onSuccess: (response) => {
                if (response.totalCount > 0) {
                    setStep(NewEmailSteps.ExistingTicket);
                    setTickets(response);
                } else {
                    setStep(NewEmailSteps.NoExistingTicket);
                }
            }
        });

    const {refetch: refetchContactTickets, isFetching: contactTicketsFetching, isLoading: contactTicketsLoading} = useQuery([QueryContactTickets, ticketsContactParams], () =>
            getContactTickets(ticketsContactParams),
        {
            enabled: false,
            onSuccess: (response) => {
                if (response.totalCount > 0) {
                    setStep(NewEmailSteps.ExistingTicket);
                    setTickets(response);
                } else {
                    setStep(NewEmailSteps.NoExistingTicket);
                }
            }
        }
    );
    useEffect(() => {
        if (!!ticketQueryParams.patientId) {
            refetchPatientTickets().then();
        }
    }, [ticketQueryParams, refetchPatientTickets]);

    useEffect(() => {
        if (!!ticketsContactParams.contactId) {
            refetchContactTickets().then();
        }
    }, [ticketsContactParams, refetchContactTickets]);

    const clearSearchResults = () => {
        setContacts([]);
        setPatients([]);
    };

    const isLoading = useMemo(() => {
        return  patientsIsLoading ||
            patientsIsFetching ||
            contactIsFetching ||
            contactIsLoading ||
            patientTicketsFetching ||
            contactTicketsFetching ||
            contactTicketsLoading
    }, [contactTicketsFetching, patientTicketsFetching, contactIsFetching, contactIsLoading, patientsIsFetching, patientsIsLoading, contactTicketsLoading]);

    const onPatientSelect = (patient: Patient) => {
        setPatientSelected(patient);
        setToName(utils.stringJoin(' ', patient.firstName, patient.lastName));
        setTicketQueryParams({...ticketQueryParams, patientId: patient.patientId});
    }

    const onContactSelect = (contact: ContactExtended) => {
        setContactSelected(contact);
        setToName(contact.type === ContactType.Company ? contact.companyName : utils.stringJoin(' ', contact.firstName, contact.lastName));
        setTicketContactParams({...ticketsContactParams, contactId: contact.id ?? ''});
    }
    const onTicketsPageChanged = (paging: Paging) => {
        setTicketQueryParams({...ticketQueryParams, ...paging});
    }

    const onTicketSelectionCancelClick = () => {
        if (patients && patients.length > 0) {
            setStep(NewEmailSteps.PatientSearchResult);
        } else if (contacts && contacts.length > 0) {
            setStep(NewEmailSteps.ContactSearchResult);
        }
        else {
            setStep(NewEmailSteps.Search);
        }
        setContactSelected(undefined);
        setPatientSelected(undefined);
    }

    const onTicketSelect = (ticket: TicketBase) => {
        history.replace(`${EmailPath}/${ticket.id}`)
        onNewTicketCreated(ticket);
    }

    const onNewTicketCreated = (ticket: TicketBase)=> {
        const existingMessage = messageSummaries.find(a => a.ticketId === ticket.id);
        if (existingMessage) {
            const index = messageSummaries.indexOf(existingMessage);
            existingMessage.messageCreatedOn = dayjs().local().toDate();
            const messages = [...messageSummaries.slice(0, index), Object.assign({}, messageSummaries[index], messageSummaries.slice(index + 1))];
            dispatch(setMessageSummaries(messages));
        } else {
            const message: TicketMessageSummary = {
                ticketId: ticket.id,
                patientId: ticket.patientId,
                contactId: ticket.contactId,
                createdForName: ticket.createdForName,
                ticketNumber: ticket.ticketNumber,
                reason: ticket.reason,
                messageSummary: t('email.new_email.draft'),
                unreadCount: 0,
                messageCreatedOn: dayjs().local().toDate(),
                messageCreatedByName: '',
                ticketType: ticket.type,
                createdForEndpoint: ''

            }
            const messages = [...messageSummaries, message];
            dispatch(setMessageSummaries(messages));
        }
    }

    const selectedValueDeleted =() => {
        setToName(undefined);
        setStep(previousStep || NewEmailSteps.Search);
    }

    const content = useMemo(() =>{
        if (step === NewEmailSteps.PatientSearchResult && patients.length > 0) {
            return <SearchboxPatientsResults
                items={patients}
                type= {ChannelTypes.Email}
                onSelect={onPatientSelect}
                paginate={true}
            />;
        } else if (step === NewEmailSteps.ContactSearchResult && contacts.length > 0) {
            return <SearchboxContactsResults
                items={contacts}
                paging={contactPagination ?? DefaultPagination}
                onSelect={onContactSelect}
                onPageChange={setContactPagination}
                type={ChannelTypes.Email}
            />;
        } else if (step === NewEmailSteps.PatientSearchResult && (patients.length === 0 || patientIsError)) {
            return <NewEmailNoSearchResult searchTerm={searchParams.value} />;
        } else if (step === NewEmailSteps.ContactSearchResult && (contacts.length === 0 || contactIsError)) {
            return <NewEmailNoSearchResult searchTerm={searchParams.value} />
        } else if (step === NewEmailSteps.ExistingTicket) {
            return <SmsNewMessageExistingTicket
                tickets={tickets}
                onTicketsPageChange={onTicketsPageChanged}
                patient={patientSelected}
                contact={contactSelected}
                type={ChannelTypes.Email}
                onClick={(ticket) => onTicketSelect(ticket)}
                onCancelClick={onTicketSelectionCancelClick}
            />;
        } else if (step === NewEmailSteps.NoExistingTicket) {
            return <SmsNewMessageNewTicket
                patient={patientSelected}
                type={ChannelTypes.Email}
                contact={contactSelected}
                onClick={(ticket) => onTicketSelect && onTicketSelect(ticket)}
                onCancelClick={onTicketSelectionCancelClick}
            />
        }
    }, [step, patients, contacts, contactPagination, tickets]);


    return <div className='w-full h-full overflow-y-auto'>
                <NewEmailHeader/>
                <NewEmailSearch value={toName} onValueClear={() => selectedValueDeleted()}  onSearchHandler={onSearchHandler}/>
                {isLoading ? <Spinner fullScreen={true}/> : content}
        </div>
}

export default NewEmail;
