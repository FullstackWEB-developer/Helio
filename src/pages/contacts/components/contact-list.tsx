import Button from '@components/button/button';
import SearchInputField from '@components/search-input-field/search-input-field';
import ContactListItem from './contact-list-item';
import ContactListLetter from './contact-list-letter';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Contact} from '@shared/models/contact.model';
import {Icon} from '@components/svg-icon/icon';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';


interface ContactListProps {
    contacts: Contact[],
    onContactSelect: (c: Contact) => void,
    handleAddNewContactClick: () => void,
    currentlySelected?: string,
    fetchMore: () => void,
    isFetchingNextPage: boolean
}
const ContactList = ({contacts, onContactSelect, currentlySelected, fetchMore, isFetchingNextPage, handleAddNewContactClick}: ContactListProps) => {
    const {t} = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    let [filteredContacts, setFilteredContacts] = useState<Contact[]>();

    const getFirstChar = (s: string) => {
        return s.trim()?.charAt(0);
    }

    const renderList = () => {
        let body: any = [];
        (filteredContacts || contacts).forEach((c, index) => {
            body.push(<ContactListItem key={index} contact={c} onSelect={onContactSelect} selected={c.id === currentlySelected} />);
            if (index < (filteredContacts || contacts).length - 1 && !searchTerm) {
                let nextLetter = getFirstChar(contacts[index + 1].name);
                if (getFirstChar(c.name) !== nextLetter) {
                    body.push(<ContactListLetter key={`letter-${nextLetter}`} letter={nextLetter} />)
                }
            }
        });
        return body;
    }
    const renderFirstLetterComponent = () => {
        const firstLetterToRender = searchTerm && searchTerm.trim().length > 0 ? getFirstChar(searchTerm.trim()).toUpperCase() : 'A';
        return <ContactListLetter key={`letter-${firstLetterToRender}`} letter={`${firstLetterToRender}`} />
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setFilteredContacts(contacts.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
    }

    const handleScroll = (event: any) => {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            fetchMore();
        }
    }

    return (
        <div className="w-72 overflow-x-hidden relative flex flex-col contact-list-section overflow-y-auto" onScroll={(e) => handleScroll(e)}>
            <div className="w-full border-b">
                <div className="w-24 py-3 pl-4">
                    <Button buttonType='small' label={t('contacts.contact-list.add')} icon={Icon.AddContact} onClick={handleAddNewContactClick} />
                </div>
            </div>
            <SearchInputField wrapperClassNames="h-12" onChange={handleSearch} value={searchTerm} placeholder={`${t('contacts.contact-list.search')}`} />
            {
                renderFirstLetterComponent()
            }
            <div className="relative max-w-full">
                {
                    renderList().map((element: any) => element)
                }
            </div>
            {
                isFetchingNextPage && <ThreeDots />
            }
        </div>
    );
}

export default ContactList;