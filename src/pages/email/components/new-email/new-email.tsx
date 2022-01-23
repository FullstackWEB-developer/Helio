import './new-email.scss';
import {useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {SearchContactResults, SearchPatient} from '@constants/react-query-constants';
import {searchType} from '@components/searchbox/constants/search-type';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getPatients, queryContacts} from '@shared/services/search.service';
import {Patient} from '@pages/patients/models/patient';
import {ContactExtended, DefaultPagination, PagedList, Paging} from '@shared/models';
import {NewEmailSteps} from '@pages/email/components/new-email/new-email-steps';
import Spinner from '@components/spinner/Spinner';
import NewEmailSearch from '@pages/email/components/new-email/components/new-email-search';
import NewEmailHeader from '@pages/email/components/new-email/components/new-email-header';
import NewEmailNoSearchResult from '@pages/email/components/new-email/components/new-email-no-search-result';
import SearchboxPatientsResults from '@components/searchbox/searchbox-patients-results';
import SearchboxContactsResults from '@components/searchbox/searchbox-contacts-results';

const NewEmail = () => {
    const [step, setStep] = useState<NewEmailSteps>(NewEmailSteps.Search);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [contacts, setContacts] = useState<ContactExtended[]>([]);
    const [patientSelected, setPatientSelected] = useState<Patient>();
    const [contactSelected, setContactSelected] = useState<ContactExtended>();
    const [contactPagination, setContactPagination] = useState<Paging>();
    const [searchParams, setSearchParams] = useState<{type: number, value: string}>({type: -1, value: ''});
    const onSearchHandler = (type: number, value: string) => {
        setSearchParams({type, value});
    }

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

    const clearSearchResults = () => {
        setContacts([]);
        setPatients([]);
    };

    const isLoading = useMemo(() => {
        return  patientsIsLoading ||
            patientsIsFetching ||
            contactIsFetching ||
            contactIsLoading
    }, [contactIsFetching, contactIsLoading, patientsIsFetching, patientsIsLoading]);

    const onSearchBoxResultSelect = (patient: Patient) => {
        setPatientSelected(patient);
    }

    const displaySearchBox = useMemo(() => {
        return (step === NewEmailSteps.Search || step === NewEmailSteps.ContactSearchResult || step === NewEmailSteps.PatientSearchResult) &&
            !patientSelected && !contactSelected;
    }, [contactSelected, patientSelected, step]);


    if (isLoading) {
        return <div className='w-full'>
            <NewEmailHeader/>
            {displaySearchBox && <NewEmailSearch  onSearchHandler={onSearchHandler}/>}
            <Spinner fullScreen={true}/>
        </div>;
    }

    const onSearchBoxContactResultSelect = (contact: ContactExtended) => {
        setContactSelected(contact);
    }

    return <div className='w-full h-full overflow-y-auto'>
                <NewEmailHeader/>
                {displaySearchBox && <NewEmailSearch  onSearchHandler={onSearchHandler}/>}
                {step === NewEmailSteps.PatientSearchResult && patients.length > 0 &&
                    <SearchboxPatientsResults
                        items={patients}
                        type='email'
                        onSelect={onSearchBoxResultSelect}
                        paginate={true}
                    />
                }
                {step === NewEmailSteps.ContactSearchResult && contacts.length > 0 &&
                    <SearchboxContactsResults
                        items={contacts}
                        paging={contactPagination ?? DefaultPagination}
                        onSelect={onSearchBoxContactResultSelect}
                        onPageChange={setContactPagination}
                        type='email'
                    />
                }

            {step === NewEmailSteps.PatientSearchResult && (patients.length === 0 || patientIsError) &&
                <NewEmailNoSearchResult searchTerm={searchParams.value} />
            }
            {step === NewEmailSteps.ContactSearchResult && (contacts.length === 0 || contactIsError) &&
                <NewEmailNoSearchResult searchTerm={searchParams.value} />
            }
        </div>
}

export default NewEmail;
