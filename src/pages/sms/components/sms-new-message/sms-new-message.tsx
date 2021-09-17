import {useEffect, useState} from 'react';
import {useQueries, useQuery} from 'react-query';
import SearchBox, {SearchBoxResults} from '@components/searchbox';
import {GetPatient, QueryPatientTickets, SearchPatient} from '@constants/react-query-constants';
import {getPatients} from '@shared/services/search.service';
import SmsNewMessageExistingTicket from './sms-new-message-existing-ticket';
import {PatientTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {DefaultPagination, PagedList, Paging} from '@shared/models';
import {getPatientTicketsPaged} from '@pages/tickets/services/tickets.service';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {SmsNewMessageSteps} from '@pages/sms/models';
import Spinner from '@components/spinner/Spinner';
import SmsNewMessageNewTicket from './sms-new-message-new-ticket';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {aggregateQueries} from '@pages/sms/utils';
import {useTranslation} from 'react-i18next';
import {searchType} from '@components/searchbox/constants/search-type';

interface SmsNewMessageProps {
    onTicketSelect?: (ticket: TicketBase) => void;
}

const SmsNewMessage = ({...props}: SmsNewMessageProps) => {
    const {t} = useTranslation();
    const [patients, setPatients] = useState<ExtendedPatient[]>([]);
    const [patientSelected, setPatientSelected] = useState<ExtendedPatient>();
    const [searchParams, setSearchParams] = useState<{type: number, value: string}>({type: -1, value: ''})
    const [tickets, setTickets] = useState<PagedList<TicketBase>>({...DefaultPagination, results: []});

    const [ticketQueryParams, setTicketQueryParams] = useState<PatientTicketsRequest>({
        ...DefaultPagination,
        pageSize: 5,
        status: 1
    });

    const [step, setStep] = useState<SmsNewMessageSteps>(SmsNewMessageSteps.Search);

    const {refetch, isLoading: patientsIsLoading, isFetching: patientsIsFetching, isError, data: patientsData = []} =
        useQuery([SearchPatient, searchParams.type, searchParams.value],
            async () => {
                setPatients([]);
                if (searchParams.type === searchType.patientId) {
                    return [await getPatientByIdWithQuery(Number(searchParams.value))]
                }
                return await getPatients(searchParams.type, searchParams.value);
            }, {
            enabled: false
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

    const {isSuccess: patientsDetailIsSuccess, data: patientsDetail, isError: isPatientDetailError, isFetching: patientDetailIsFetching} = aggregateQueries<ExtendedPatient>(
        useQueries(
            patientsData.map(patient => ({
                enabled: patientsData.length > 0,
                queryKey: [GetPatient, patient.patientId],
                queryFn: () => getPatientByIdWithQuery(patient.patientId),
            }))
        )
    );

    useEffect(() => {
        if (patientsDetailIsSuccess) {
            setPatients(patientsDetail);
            setStep(SmsNewMessageSteps.SearchResult);
        }
    }, [patientsDetailIsSuccess])

    useEffect(() => {
        if (!!searchParams.value && searchParams.type > 0) {
            refetch();
        }
    }, [refetch, searchParams]);

    useEffect(() => {
        if (!!ticketQueryParams.patientId) {
            ticketRefetch();
        }
    }, [ticketQueryParams, ticketRefetch]);

    const isLoading = patientsIsLoading || patientsIsFetching || ticketIsFetching || patientDetailIsFetching;

    const onSearchBoxResultSelect = (patient: ExtendedPatient) => {
        setPatientSelected(patient);
        setTicketQueryParams({...ticketQueryParams, patientId: patient.patientId});
    }

    const onTicketsPageChanged = (paging: Paging) => {
        setTicketQueryParams({...ticketQueryParams, ...paging});
    }

    const onCancelClick = () => {
        if (patients && patients.length > 0) {
            setStep(SmsNewMessageSteps.SearchResult);
        } else {
            setStep(SmsNewMessageSteps.Search);
        }
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-row items-center w-full px-4 border-b'>
                <div className='pr-1 body2'>{t('sms.chat.new.to')}</div>
                <SearchBox
                    className='w-full'
                    dropdownClassName='z-10'
                    onSearch={(type, value) => setSearchParams({type, value})}
                />
            </div>
            <div className='overflow-y-auto'>
                {isLoading &&
                    <Spinner fullScreen />
                }
                {!isLoading && step === SmsNewMessageSteps.SearchResult &&
                    <SearchBoxResults
                        items={patients}
                        onSelect={onSearchBoxResultSelect}
                    />
                }
                {isError && !isLoading &&
                    <div className="pt-8 pl-6 body2">{t('search.search_results.empty', {searchTerm: searchParams.value})}</div>
                }
                {isPatientDetailError &&
                    <div className="pt-8 pl-6 body2">{t('common.error')}</div>
                }
                {!isLoading && step === SmsNewMessageSteps.ExistingTicket &&
                    <SmsNewMessageExistingTicket
                        tickets={tickets}
                        onTicketsPageChange={onTicketsPageChanged}
                        patient={patientSelected}
                        onClick={(t) => props.onTicketSelect && props.onTicketSelect(t)}
                        onCancelClick={onCancelClick}
                    />
                }
                {!isLoading && step === SmsNewMessageSteps.NoExistingTicket &&
                    <SmsNewMessageNewTicket
                        patient={patientSelected}
                        onClick={(t) => props.onTicketSelect && props.onTicketSelect(t)}
                        onCancelClick={onCancelClick}
                    />
                }
            </div>
        </div >
    );
}

export default SmsNewMessage;
