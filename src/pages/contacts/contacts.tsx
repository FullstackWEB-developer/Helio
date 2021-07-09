import React, {useEffect, useState} from 'react';
import './contacts.scss';
import {useTranslation} from 'react-i18next';
import ContactCategory from './components/contact-category';
import ContactList from './components/contact-list';
import {ContactBase, ContactExtended} from '@shared/models/contact.model';
import {useHistory, useParams} from 'react-router-dom';
import {ContactsPath} from 'src/app/paths';
import ContactDetails from './components/contact-details';
import {useInfiniteQuery, useQuery, useQueryClient} from 'react-query';
import AddNewContact from './components/add-new-contact';
import {QueryContactsInfinite, QueryStates} from '@constants/react-query-constants';
import {getContactById, queryContactsInfinite} from '@shared/services/contacts.service';
import {QueryContactRequest} from '@shared/models/query-contact-request';
import {ContactCategory as ContactCategoryEnum} from '@shared/models/contact-category.enum';
import useDebounce from '@shared/hooks/useDebounce';
import {useDispatch, useSelector} from 'react-redux';
import {getStates} from '@shared/services/lookups.service';
import {setStates} from '@shared/store/lookups/lookups.slice';
import {Option} from '@components/option/option';
import {DEBOUNCE_SEARCH_DELAY_MS} from '@constants/form-constants';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {getPageSize} from './contact-helpers/helpers';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import Spinner from '@components/spinner/Spinner';
import {selectGlobalLoading} from '@shared/store/app/app.selectors';

interface ContactProps { }
const Contacts: React.FC<ContactProps> = () => {
    const {t} = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>(t('contacts.category.all_contacts'));
    const [selectedContact, setSelectedContact] = useState<ContactExtended>();
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceSearchTerm] = useDebounce(searchTerm, DEBOUNCE_SEARCH_DELAY_MS);
    const [editMode, setEditMode] = useState(false);
    const [addNewContactMode, setAddNewContactMode] = useState(false);
    const isGlobalLoading = useSelector(selectGlobalLoading);
    const [queryParams, setQueryParams] = useState<QueryContactRequest>({pageSize: getPageSize()});
    const history = useHistory();
    const {contactId} = useParams<{contactId: string}>();
    const handleContactSelect = (c: ContactExtended) => {
        if (c.id !== selectedContact?.id) {
            setSelectedContact(c);
            setAddNewContactMode(false);
            setEditMode(false);
            history.replace(`${ContactsPath}/${c.id}`);
        }
    }

    const dispatch = useDispatch();

    const queryClient = useQueryClient();

    const {isFetching: isFetchingStates} = useQuery(QueryStates, () => getStates(),
        {
            onSuccess: (data: any) => {
                const managedStates = data.map((item: any) => {
                    return {
                        value: item.stateCode,
                        label: item.name
                    } as Option;
                })
                dispatch(setStates(managedStates));
            }
        }
    );

    const {fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch, data} = useInfiniteQuery([QueryContactsInfinite, queryParams],
        ({pageParam = 1}) => {
            dispatch(setGlobalLoading(true));
            return queryContactsInfinite(pageParam, queryParams);
        }, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        onSettled: () => {
            dispatch(setGlobalLoading(false));
        }
    });

    useEffect(() => {
        setQueryParams(handleCategoryChange(selectedCategory));
    }, [selectedCategory]);

    useEffect(() => {
        setQueryParams({...queryParams, searchTerm: debounceSearchTerm, page: 1})
    }, [debounceSearchTerm]);

    const handleCategoryChange = (selectedCategory: string): QueryContactRequest => {
        let category;
        let starredOnly = false;
        if (selectedCategory === t('contacts.category.all_contacts')) {
            category = null;
        }
        if (selectedCategory === t('contacts.category.starred_contacts')) {
            category = null;
            starredOnly = true;
        }
        category = ContactCategoryEnum[selectedCategory as keyof typeof ContactCategoryEnum];
        return {
            ...queryParams,
            category,
            page: 1,
            starredOnly
        }
    }
    useEffect(() => {
        refetch();
    }, [queryParams, refetch])

    const accumulateAllData = (): ContactExtended[] => {
        if (data && data.pages) {
            return !searchTerm.length ? data?.pages.reduce((acc, val) => acc.concat(val.data.results), []) :
                data?.pages.reduce((acc, val) => acc.concat(val.data.results), [])
                    .sort((a: ContactExtended, b: ContactExtended) => a.type! - b.type!);
        }
        return [];
    }
    const fetchMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }
    const toggleEditMode = () => {
        setEditMode(!editMode);
    }
    const handleAddNewContactClick = () => {
        setSelectedContact(undefined);
        setEditMode(false);
        history.replace(`${ContactsPath}`);
        setAddNewContactMode(true);
    }

    const closeAddNewContactForm = () => {
        setAddNewContactMode(false);
    }

    const onContactAddSuccess = (contact: ContactExtended) => {
        setAddNewContactMode(false);

        dispatch(addSnackbarMessage({
            type: SnackbarType.Success,
            message: 'contacts.contact-details.contact_created'
        }));

        history.replace(`${ContactsPath}/${contact.id}`);
    }

    const onContactAddError = () => {
        dispatch(addSnackbarMessage({
            type: SnackbarType.Error,
            message: 'contacts.contact-details.error_created_contact'
        }));
    }

    const onContactUpdateSuccess = (contact: ContactExtended) => {
        setEditMode(false);
        setSelectedContact(contact);

        dispatch(addSnackbarMessage({
            type: SnackbarType.Success,
            message: 'contacts.contact-details.contact_updated'
        }))
    }

    const onContactUpdateError = () => {
        dispatch(addSnackbarMessage({
            type: SnackbarType.Error,
            message: 'contacts.contact-details.error_updated_contact'
        }))
    }
    const onToggleFavoriteSuccess = () => {
        if (selectedContact) {
            setSelectedContact({
                ...selectedContact, isStarred: !selectedContact?.isStarred
            });
        }
    }

    const onDeleteSuccess = (contactId: string) => {
        setSelectedContact(undefined);

        const paginatedContacts: any = queryClient.getQueryData([QueryContactsInfinite]);

        for (let page of paginatedContacts?.pages) {
            let foundOnPage = false;
            if (page?.data?.results && page?.data?.results.length > 0) {
                page.data.results = page.data.results.filter((c: ContactBase) => {
                    foundOnPage = c.id === contactId;
                    return c.id !== contactId;
                });
            }
            if (foundOnPage) break;
        }
        queryClient.setQueryData([QueryContactsInfinite], paginatedContacts);

        dispatch(addSnackbarMessage({
            type: SnackbarType.Success,
            message: 'contacts.contact-details.contact_deleted'
        }))

        history.replace(ContactsPath);
    }

    const onDeleteError = () => {
        dispatch(addSnackbarMessage({
            type: SnackbarType.Error,
            message: 'contacts.contact-details.error_deleted_contact'
        }))
    }

    const {isFetching: isFetchingSingleContact, refetch: refetchSingle, isError: isErrorFetchingSingleContact} = useQuery([QueryContactsInfinite, contactId],
        () => getContactById(contactId),
        {
            onSuccess: (contact: ContactExtended) => {
                setSelectedContact(contact);
            },
            enabled: false
        }
    );

    useEffect(() => {
        if (contactId) {
            refetchSingle();
        }
    }, [refetchSingle, contactId]);

    return (
        <div className="flex w-full">
            <ContactCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <ContactList contacts={accumulateAllData()} onContactSelect={handleContactSelect} currentlySelected={selectedContact?.id}
                fetchMore={fetchMore} isFetching={isFetching} isFetchingNextPage={isFetchingNextPage} handleAddNewContactClick={handleAddNewContactClick}
                searchValue={searchTerm} searchHandler={(value: string) => {setSearchTerm(value)}} />
            {
                isErrorFetchingSingleContact && <h6 className='text-danger mt-2 mb-5 px-8'>{t('contacts.contact-details.error_fetching_contact')}</h6>
            }
            {
                (isFetchingStates || isFetchingSingleContact) && !isGlobalLoading && <Spinner fullScreen />
            }
            {
                selectedContact && !isFetchingSingleContact && !isFetchingStates &&
                <ContactDetails contact={selectedContact} editMode={editMode}
                    editIconClickHandler={toggleEditMode}
                    addNewContactHandler={handleAddNewContactClick}
                    onUpdateSuccess={onContactUpdateSuccess}
                    onUpdateError={onContactUpdateError}
                    onToggleFavoriteSuccess={onToggleFavoriteSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                    onDeleteError={onDeleteError}
                />
            }
            {addNewContactMode &&
                <AddNewContact
                    onContactAddSuccess={onContactAddSuccess}
                    onContactAddError={onContactAddError}
                    closeAddNewContactForm={closeAddNewContactForm}
                />
            }
        </div>
    );
};

export default Contacts;
