import {useLocation} from 'react-router-dom';
import PatientSearchResults from './patient-search-results';
import './search-results.scss';
import {ContactsPath, TicketsPath} from '@app/paths';
import ContactSearchResults from './contact-search-results';
import TicketSearchResults from './ticket-search-results';

const SearchResults = () => {

    const location = useLocation<{query: string}>();

    const renderSearchResults = () => {
        switch (location.pathname) {
            case "/patients/results": {
                return <PatientSearchResults />;
            }
            case `${TicketsPath}/results`: {
                return <TicketSearchResults />
            }
            case `${ContactsPath}/results`: {
                return <ContactSearchResults />
            }
        }
    }

    return (
        <div className='w-full'>
            {
                renderSearchResults()
            }
        </div>
    );
}

export default SearchResults;
