import SearchInputField from '@components/search-input-field/search-input-field';
import ContactListItem from './contact-list-item';
import ContactListLetter from './contact-list-letter';
import {useTranslation} from 'react-i18next';
import {ContactBase, ContactExtended} from '@shared/models/contact.model';
import {Icon} from '@components/svg-icon/icon';
import {ContactType} from '@shared/models/contact-type.enum';
import React from 'react';
import Spinner from '@components/spinner/Spinner';
import SvgIcon from '@components/svg-icon';
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
        const isCompany = c?.type === ContactType.Company;
        const firstChar = isCompany ? c?.companyName?.trim()?.charAt(0) : c?.firstName?.trim()?.charAt(0);
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
                body.push(<ContactListLetter key={`letter-${firstLetter}${index}`}
                    letter={firstLetter} />);
            }

            body.push(<ContactListItem isSearch={!!props.searchValue}
                previousContact={contacts[index - 1]}
                key={c?.id} contact={c}
                onSelect={onContactSelect}
                selected={c?.id === currentlySelected} />);

            if (index < contacts.length - 1 && !props.searchValue.length) {
                const nextLetter = getFirstChar(contacts[index + 1]);
                if (getFirstChar(c).toLowerCase() !== nextLetter.toLowerCase()) {
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
        if (target.scrollHeight <= target.scrollTop + target.clientHeight) {
            fetchMore();
        }
    }

    return (
        <div className="w-72 overflow-x-hidden relative flex flex-col contact-list-section" >
            <div className="w-full">
                <div className='flex items-center pl-4 py-3 cursor-pointer align-middle border-b'
                    onClick={handleAddNewContactClick}>
                    <SvgIcon type={Icon.AddContact}
                        className='icon-large pl-1 cursor-pointer'
                        fillClass='active-item-icon' />
                    <span className='body2 pl-4 contact-accent-color'>{`${t('contacts.contact-list.add')}`}</span>
                </div>
            </div>
            <SearchInputField wrapperClassNames="pl-2 py-6"
                inputClassNames='contact-search-input-field'
                onChange={handleSearch}
                value={props.searchValue}
                placeholder={`${t('contacts.contact-list.search')}`} />
            <div className="relative max-w-full overflow-y-auto overflow-x-hidden h-full" onScroll={(e) => handleScroll(e)}>
                {
                    isFetching && !isFetchingNextPage ? <Spinner size='small' className='pt-2' /> :
                        React.Children.toArray(renderList().map((element: any) => element))
                }
            </div>
        </div>
    );
}

export default ContactList;
