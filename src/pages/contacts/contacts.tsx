import React, {useEffect, useState} from 'react';
import './contacts.scss';
import {useTranslation} from 'react-i18next';
import ContactCategory from './components/contact-category';
import ContactList from './components/contact-list';
import {Contact} from '@shared/models/contact.model';
import {useHistory, useParams} from 'react-router-dom';
import {ContactsPath} from 'src/app/paths';
import ContactDetails from './components/contact-details';
import {useInfiniteQuery} from 'react-query';
import {getContacts} from './services/contacts.service';
import AddNewContact from './components/add-new-contact';

interface ContactProps { }
const Contacts: React.FC<ContactProps> = () => {
    const {t} = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>(t('contacts.category.all_contacts'));
    const [selectedContact, setSelectedContant] = useState<Contact>();
    const [editMode, setEditMode] = useState(false);
    const [addNewContactMode, setAddNewContactMode] = useState(false);
    const history = useHistory();
    const {contactId} = useParams<{contactId: string}>();
    const handleContactSelect = (c: Contact) => {
        setSelectedContant(c);
        setAddNewContactMode(false);
        history.replace(`${ContactsPath}/${c.id}`);
    }
    useEffect(() => {
        if (contactId) {
            // TODO fetch single patient and display
        }
    }, []);
    const {fetchNextPage, hasNextPage, isFetchingNextPage, data} = useInfiniteQuery(['contacts'], 
    ({pageParam = 1}) => getContacts(pageParam), {
        
        getNextPageParam: (lastPage) => lastPage.nextPage
    });

    const accumulateAllData = () : Contact[] => {
        if(data && data.pages){
            return data?.pages.reduce((acc, val) => acc.concat(val.data), []).sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
        }        
        return [];
    }
    const fetchMore = () => {        
        if(hasNextPage){
            fetchNextPage();        
        }        
    }
    const toggleEditMode = () => {
        setEditMode(!editMode);
    }
    const handleAddNewContactClick = () => {
        setSelectedContant(undefined);
        history.replace(`${ContactsPath}`);
        setAddNewContactMode(true);
    }    

    return (
        <div className="flex w-full">
            <ContactCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <ContactList contacts={accumulateAllData()} onContactSelect={handleContactSelect} currentlySelected={selectedContact?.id}
            fetchMore={fetchMore} isFetchingNextPage={isFetchingNextPage} handleAddNewContactClick={handleAddNewContactClick}/>
            {
                selectedContact && <ContactDetails contact={selectedContact} editMode={editMode} editIconClickHandler={toggleEditMode} />
            }
            {
                addNewContactMode && <AddNewContact />
            }
        </div>
    );
};

export default Contacts;