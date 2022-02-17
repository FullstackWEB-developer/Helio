import {useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import SearchBox from '@components/searchbox';
import {QueryContactTickets, QueryPatientTickets, SearchContactResults, SearchPatient} from '@constants/react-query-constants';
import {getPatients, queryContacts} from '@shared/services/search.service';
import SmsNewMessageExistingTicket from './sms-new-message-existing-ticket';
import {ContactTicketsRequest, PatientTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {
    ChannelTypes,
    ContactExtended,
    DefaultPagination,
    PagedList,
    Paging,
    TicketMessageSummary
} from '@shared/models';
import {getContactTickets, getPatientTicketsPaged} from '@pages/tickets/services/tickets.service';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {SmsNewMessageSteps} from '@pages/sms/models';
import Spinner from '@components/spinner/Spinner';
import SmsNewMessageNewTicket from './sms-new-message-new-ticket';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {useTranslation} from 'react-i18next';
import {searchType} from '@components/searchbox/constants/search-type';
import {TicketType} from '@pages/tickets/models/ticket-type.enum';
import {Patient} from '@pages/patients/models/patient';
import {ContactType} from '@pages/contacts/models/ContactType';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import SearchboxContactsResults from '@components/searchbox/searchbox-contacts-results';
import SearchboxPatientsResults from '@components/searchbox/searchbox-patients-results';
import ConversationHeader from '@components/conversation-header/conversation-header';

interface SmsNewMessageProps {
    onTicketSelect?: (ticket: TicketBase) => void;
    selectedContact?: ContactExtended,
    selectedPatient?: ExtendedPatient,
}
const SmsNewMessage = ({...props}: SmsNewMessageProps) => {
    const {t} = useTranslation();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [contacts, setContacts] = useState<ContactExtended[]>([]);
    const [patientSelected, setPatientSelected] = useState<Patient>();
    const [contactSelected, setContactSelected] = useState<ContactExtended>();
    const [searchParams, setSearchParams] = useState<{type: number, value: string}>({type: -1, value: ''})
    const [tickets, setTickets] = useState<PagedList<TicketBase>>({...DefaultPagination, results: []});
    const [ticketsContactParams, setTicketContactParams] = useState<ContactTicketsRequest>({...DefaultPagination, contactId: ''});
    const [contactPagination, setContactPagination] = useState<Paging>();
    const [ticketQueryParams, setTicketQueryParams] = useState<PatientTicketsRequest>({
        ...DefaultPagination,
        pageSize: 5,
        status: 1
    });

    const [step, setStep] = useState<SmsNewMessageSteps>(SmsNewMessageSteps.Search);

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
                setStep(SmsNewMessageSteps.SearchResult);
            }
        }
        );


    const {isFetching: contactIsFetching, isLoading: contactIsLoading, isError: isContactError} =
        useQuery<PagedList<ContactExtended>>([SearchContactResults, searchParams.type, searchParams.value, contactPagination],
            () => {clearSearchResults(); return queryContacts(searchParams.value, contactPagination?.page)}, {
            enabled: getContactQueryEnabled(),
            onSuccess: (response) => {
                const {results, ...paging} = response;
                setContacts(results);
                setStep(SmsNewMessageSteps.SearchContactResult);
                setContactPagination({...paging});
            }
        });

    const {refetch: ticketRefetch, isFetching: ticketIsFetching} = useQuery([QueryPatientTickets, ticketQueryParams],
        () => getPatientTicketsPaged(ticketQueryParams), {
        enabled: false,
        onSuccess: (response) => {
            if (response.totalCount > 0) {
                setStep(SmsNewMessageSteps.ExistingTicket);
                setTickets(response);
            } else {
                setStep(SmsNewMessageSteps.NoExistingTicket);
            }
        }
    });
    const {refetch: ticketContactRefetch, isFetching: isTicketContactFetching, isLoading: isTicketContactLoading} = useQuery([QueryContactTickets, ticketsContactParams], () =>
        getContactTickets(ticketsContactParams),
        {
            enabled: false,
            onSuccess: (response) => {
                if (response.totalCount > 0) {
                    setStep(SmsNewMessageSteps.ExistingTicket);
                    setTickets(response);
                } else {
                    setStep(SmsNewMessageSteps.NoExistingTicket);
                }
            }
        }
    );

    const NoSearchResult = () => (
        <div className="pt-8 pl-6 body2">{t('search.search_results.empty', {searchTerm: searchParams.value})}</div>
    )

    useEffect(() => {
        if (!!ticketQueryParams.patientId) {
            ticketRefetch();
        }
    }, [ticketQueryParams, ticketRefetch]);

    useEffect(() => {
        if (!!ticketsContactParams.contactId) {
            ticketContactRefetch();
        }
    }, [ticketsContactParams, ticketContactRefetch]);

    useEffect(() => {
        if (!!props.selectedContact) {
            onSearchBoxContactResultSelect(props.selectedContact);
        }
    }, [props.selectedContact]);

    useEffect(() => {
        if (!!props.selectedPatient) {
            onSearchBoxResultSelect(props.selectedPatient);
        }
    }, [props.selectedPatient]);

    const isLoading = patientsIsLoading ||
        patientsIsFetching ||
        contactIsFetching ||
        contactIsLoading ||
        ticketIsFetching ||
        isTicketContactLoading ||
        isTicketContactFetching;

    const onSearchBoxResultSelect = (patient: Patient) => {
        setPatientSelected(patient);
        setTicketQueryParams({...ticketQueryParams, patientId: patient.patientId});
    }

    const onSearchBoxContactResultSelect = (contact: ContactExtended) => {
        setContactSelected(contact);
        setTicketContactParams({...ticketsContactParams, contactId: contact.id ?? ''})
    }

    const onTicketsPageChanged = (paging: Paging) => {
        setTicketQueryParams({...ticketQueryParams, ...paging});
    }

    const onCancelClick = () => {
        if (patients && patients.length > 0) {
            setStep(SmsNewMessageSteps.SearchResult);
        } else if (contacts && contacts.length > 0) {
            setStep(SmsNewMessageSteps.SearchContactResult);
        }
        else {
            setStep(SmsNewMessageSteps.Search);
        }
        setContactSelected(undefined);
        setPatientSelected(undefined);
    }

    const onContactPaginationChanged = (paging: Paging) => {
        setContactPagination({...paging});
    }

    const shouldSearchInputBeVisible = () => {
        return (step === SmsNewMessageSteps.Search || step === SmsNewMessageSteps.SearchContactResult || step === SmsNewMessageSteps.SearchResult) &&
            !patientSelected && !contactSelected;
    }

     const createdForName = useMemo(() => {
         if (patientSelected) {
             return `${patientSelected.firstName || ''} ${patientSelected.lastName || ''}`;
         }
         if(contactSelected) {
             return contactSelected.type === ContactType.Company ? contactSelected.companyName : `${contactSelected.firstName || ''} ${contactSelected.lastName || ''}`
         }

     }, [contactSelected, patientSelected]);

    const ticketMessageSummary: TicketMessageSummary = {
        // Object just for satisfying typescript and types, fields used in SmsHeader component below are patientId and contactId, createdForName
        ...(contactSelected?.id && {contactId: contactSelected.id}),
        ...(patientSelected?.patientId && {patientId: patientSelected.patientId}),
        createdForName: createdForName || '',
        ticketId: '',
        ticketNumber: 0,
        ticketType: TicketType.Default,
        unreadCount: 0,
        createdForEndpoint: '',
        messageCreatedByName: '',
        messageCreatedOn: new Date(),
        messageSummary: '',
        reason: ''
    }

    const onSearchHandler = (type: number, value: string) => {
        setSearchParams({type, value});
    }

    const clearSearchResults = () => {
        setContacts([]);
        setPatients([]);
    }

    return (
        <div className='flex flex-col h-full'>
            <div className={`flex flex-row items-center w-full px-4 border-b ${shouldSearchInputBeVisible() ? 'block' : 'hidden'}`}>
                <div className='pr-1 body2'>{t('sms.chat.new.to')}</div>
                <SearchBox
                    className='w-full'
                    dropdownClassName='z-10'
                    onSearch={(type, value) => onSearchHandler(type, value)}
                />
            </div>
            {
                !shouldSearchInputBeVisible() && <ConversationHeader info={ticketMessageSummary} forNewTicketMessagePurpose={true} conversationChannel={ChannelTypes.SMS} />
            }

            <div className='h-full overflow-y-auto'>
                {isLoading &&
                    <Spinner fullScreen />
                }
                {!isLoading && step === SmsNewMessageSteps.SearchResult && (patients.length === 0 || patientIsError) &&
                    <NoSearchResult />
                }
                {!isLoading && step === SmsNewMessageSteps.SearchResult && patients.length > 0 &&
                    <SearchboxPatientsResults
                        type={ChannelTypes.SMS}
                        items={patients}
                        onSelect={onSearchBoxResultSelect}
                    />
                }
                {!contactIsLoading && step === SmsNewMessageSteps.SearchContactResult && contacts.length > 0 &&
                    <SearchboxContactsResults
                        items={contacts}
                        paging={contactPagination ?? DefaultPagination}
                        onSelect={onSearchBoxContactResultSelect}
                        onPageChange={onContactPaginationChanged}
                        type={ChannelTypes.SMS}
                    />
                }
                {!contactIsLoading && step === SmsNewMessageSteps.SearchContactResult && (contacts.length === 0 || isContactError) &&
                    <NoSearchResult />
                }
                {!isLoading && step === SmsNewMessageSteps.ExistingTicket &&
                    <SmsNewMessageExistingTicket
                        tickets={tickets}
                        type={ChannelTypes.SMS}
                        onTicketsPageChange={onTicketsPageChanged}
                        patient={patientSelected}
                        contact={contactSelected}
                        onClick={(ticket) => props.onTicketSelect && props.onTicketSelect(ticket)}
                        onCancelClick={onCancelClick}
                    />
                }
                {!isLoading && step === SmsNewMessageSteps.NoExistingTicket &&
                    <SmsNewMessageNewTicket
                        type={ChannelTypes.SMS}
                        patient={patientSelected}
                        contact={contactSelected}
                        onClick={(ticket) => props.onTicketSelect && props.onTicketSelect(ticket)}
                        onCancelClick={onCancelClick}
                    />
                }
            </div>
        </div >
    );
}

export default SmsNewMessage;
