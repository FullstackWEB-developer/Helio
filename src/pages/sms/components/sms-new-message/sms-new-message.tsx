import {useEffect, useState} from 'react';
import {useQueries, useQuery} from 'react-query';
import SearchBox, {SearchBoxResults} from '@components/searchbox';
import {GetPatient, QueryContactTickets, QueryPatientTickets, SearchContactResults, SearchPatient} from '@constants/react-query-constants';
import {getPatients, queryContacts} from '@shared/services/search.service';
import SmsNewMessageExistingTicket from './sms-new-message-existing-ticket';
import {ContactTicketsRequest, PatientTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {ContactExtended, DefaultPagination, PagedList, Paging, TicketMessage, TicketMessageBase, TicketMessageSummary} from '@shared/models';
import {getContactTickets, getPatientTicketsPaged} from '@pages/tickets/services/tickets.service';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {SmsNewMessageSteps} from '@pages/sms/models';
import Spinner from '@components/spinner/Spinner';
import SmsNewMessageNewTicket from './sms-new-message-new-ticket';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {aggregateQueries} from '@pages/sms/utils';
import {useTranslation} from 'react-i18next';
import {searchType} from '@components/searchbox/constants/search-type';
import SearchBoxContactResults from '../sms-search-box/searchbox-contact-results';
import SmsHeader from '../sms-header/sms-header';
import {TicketType} from '@pages/tickets/models/ticket-type.enum';
import {Patient} from '@pages/patients/models/patient';

interface SmsNewMessageProps {
    onTicketSelect?: (ticket: TicketBase) => void;
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

    const ticketMessageSummary: TicketMessageSummary = {
        // Object just for satisfying typescript and types, fields used in SmsHeader component below are patientId and contactId, createdForName
        ...(contactSelected?.id && {contactId: contactSelected.id}),
        ...(patientSelected?.patientId && {patientId: patientSelected.patientId}),
        createdForName: contactSelected ? `${contactSelected.firstName || ''} ${contactSelected.lastName || ''}` :
            patientSelected ? `${patientSelected.firstName || ''} ${patientSelected.lastName || ''}` : '',
        ticketId: '',
        ticketNumber: 0,
        ticketType: TicketType.Default,
        unreadCount: 0,
        createdForMobileNumber: '',
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
                !shouldSearchInputBeVisible() && <SmsHeader info={ticketMessageSummary} forNewTicketMessagePurpose={true} />
            }

            <div className='h-full overflow-y-auto'>
                {isLoading &&
                    <Spinner fullScreen />
                }
                {!isLoading && step === SmsNewMessageSteps.SearchResult && (patients.length === 0 || patientIsError) &&
                    <NoSearchResult />
                }
                {!isLoading && step === SmsNewMessageSteps.SearchResult && patients.length > 0 &&
                    <SearchBoxResults
                        items={patients}
                        onSelect={onSearchBoxResultSelect}
                    />
                }
                {!contactIsLoading && step === SmsNewMessageSteps.SearchContactResult && contacts.length > 0 &&
                    <SearchBoxContactResults
                        items={contacts}
                        paging={contactPagination ?? DefaultPagination}
                        onSelect={onSearchBoxContactResultSelect}
                        onPageChange={onContactPaginationChanged}
                    />
                }
                {!contactIsLoading && step === SmsNewMessageSteps.SearchContactResult && (contacts.length === 0 || isContactError) &&
                    <NoSearchResult />
                }
                {!isLoading && step === SmsNewMessageSteps.ExistingTicket &&
                    <SmsNewMessageExistingTicket
                        tickets={tickets}
                        onTicketsPageChange={onTicketsPageChanged}
                        patient={patientSelected}
                        contact={contactSelected}
                        onClick={(ticket) => props.onTicketSelect && props.onTicketSelect(ticket)}
                        onCancelClick={onCancelClick}
                    />
                }
                {!isLoading && step === SmsNewMessageSteps.NoExistingTicket &&
                    <SmsNewMessageNewTicket
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
