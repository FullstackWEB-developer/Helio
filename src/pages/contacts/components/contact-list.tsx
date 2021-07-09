import Button from '@components/button/button';
import SearchInputField from '@components/search-input-field/search-input-field';
import ContactListItem from './contact-list-item';
import ContactListLetter from './contact-list-letter';
import {useTranslation} from 'react-i18next';
import {ContactBase, ContactExtended} from '@shared/models/contact.model';
import {Icon} from '@components/svg-icon/icon';
import {ContactType} from '@shared/models/contact-type.enum';
import React from 'react';
import Spinner from '@components/spinner/Spinner';
interface ContactListProps {
    contacts: ContactExtended[],
    onContactSelect: (c: ContactExtended) => void,
    handleAddNewContactClick: () => void,
    currentlySelected?: string,
    fetchMore: () => void,
    isFetchingNextPage: boolean,
    isFetching: boolean,
    searchValue: string,
    searchHandler: (value: string) => void
}
const ContactList = ({contacts, onContactSelect, currentlySelected, fetchMore, isFetching, isFetchingNextPage, handleAddNewContactClick, ...props}: ContactListProps) => {
    const {t} = useTranslation();

    const getFirstChar = (c: ContactBase) => {
        const isCompany = c.type === ContactType.Company;
        const firstChar = isCompany ? c.companyName?.trim()?.charAt(0) : c.firstName?.trim()?.charAt(0);
        return firstChar ?? '';
    }

    const renderList = () => {
        const body: React.ReactNode[] = [];
        if (!contacts || contacts.length === 0) {
            body.push(<div className='subtitle3-small w-full text-center mt-5'>{t('contacts.contact-list.no_results')}</div>);
        }
        contacts.forEach((c, index) => {
            if (index === 0) {
                const firstLetter = getFirstChar(c);
                body.push(<ContactListLetter key={`letter-${firstLetter}${index}`} letter={firstLetter} />);
            }

            body.push(<ContactListItem key={c.id} contact={c} onSelect={onContactSelect} selected={c.id === currentlySelected} />);

            if (index < contacts.length - 1 && !props.searchValue.length) {
                const nextLetter = getFirstChar(contacts[index + 1]);
                if (getFirstChar(c) !== nextLetter) {
                    body.push(<ContactListLetter key={`letter-${nextLetter}${index}`} letter={nextLetter} />)
                }
            }
        });
        body.push(<div key={`loading-container`} className={!isFetchingNextPage ? 'invisible' : 'visible'}><Spinner fullScreen /></div>);
        return body;
    }

    const handleSearch = (value: string) => {
        props.searchHandler(value);
    }

    const handleScroll = (event: any) => {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            fetchMore();
        }
    }

    return (
        <div className="w-72 overflow-x-hidden relative flex flex-col contact-list-section" >
            <div className="w-full border-b">
                <div className="w-24 py-3 pl-4">
                    <Button buttonType='small' label={t('contacts.contact-list.add')} icon={Icon.AddContact} onClick={handleAddNewContactClick} />
                </div>
            </div>
            <SearchInputField wrapperClassNames="h-12" onChange={handleSearch} value={props.searchValue} placeholder={`${t('contacts.contact-list.search')}`} />
            <div className="relative max-w-full overflow-y-auto overflow-x-hidden" onScroll={(e) => handleScroll(e)}>
                {
                    isFetching && !isFetchingNextPage ? <div /> :
                        React.Children.toArray(renderList().map((element: any) => element))
                }
            </div>
        </div>
    );
}

export default ContactList;
