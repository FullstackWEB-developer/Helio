import React, {useRef, useState} from 'react';
import {SearchType} from './models/search-type';
import {selectRecentPatients, selectSearchTermDisplayValue, selectSearchTypeFiltered, selectSelectedType} from './store/search-bar.selectors';
import {
    changeFilteredTypes,
    changeTypeDown,
    changeTypeUp,
    clearRecentPatients,
    setType,
    setSearchTerm,
    setSearchTermDisplayValue, resetFilteredTypes
} from './store/search-bar.slice';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {RecentPatient} from './models/recent-patient';
import RecentPatientDetails from './components/recent-patient-details';
import {searchTypePatient, searchTypeContact, searchTypeTicket} from './constants/search-type';
import {keyboardKeys} from './constants/keyboard-keys';
import Dropdown from '../dropdown/dropdown';
import {CategoryItemModel, DropdownItemModel, DropdownModel} from '../dropdown/dropdown.models';
import './search-bar.scss';
import customHooks from '../../hooks/customHooks';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import {SearchCategory} from './constants/search-type-const';

const SearchBar = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [dropdownDisplayed, displayDropdown] = useState(false);
    const searchTermDisplayValue = useSelector(selectSearchTermDisplayValue);
    const recentPatients = useSelector(selectRecentPatients);
    const selectedType = useSelector(selectSelectedType);
    const searchTypeFiltered = useSelector(selectSearchTypeFiltered);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const textChange = (value: string) => {
        displayDropdown(true);
        dispatch(setSearchTermDisplayValue(value.trim()));
        dispatch(changeFilteredTypes(value.trim()));
    }

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case keyboardKeys.enter:
                handleSearch();
                displayDropdown(false);
                break;
            case keyboardKeys.arrowUp:
                dispatch(changeTypeUp());
                break;
            case keyboardKeys.arrowDown:
                dispatch(changeTypeDown());
                break;
        }
    }

    const handleSearch = () => {
        dispatch(setType(selectedType));
        switch (Number(selectedType)) {
            case searchTypeContact.contactName:
                searchContactHandler();
                break;
            case searchTypeTicket.ticketId:
            case searchTypeTicket.patientOrContactName:
                searchTicketHandler();
                break;
            default:
                searchPatientHandler();
                break;
        }
    }

    const searchPatientHandler = (type?: number) => {
        const chosenType = commonSearchHandler(type);
        if (searchTermDisplayValue.trim() !== '') {
            dispatch(resetFilteredTypes());
            if (chosenType === searchTypePatient.patientId) {
                dispatch(setSearchTermDisplayValue(''));
                history.push('/patients/' + searchTermDisplayValue.trim());
            }
            else {
                history.push('/patients/results');
            }
        }
    }

    const searchContactHandler = (type?: number) => {
        commonSearchHandler(type);
        if (searchTermDisplayValue.trim() !== '') {
            dispatch(resetFilteredTypes());
            history.push('/contacts/results');
        }
    }

    const commonSearchHandler = (type?: number) => {
        const chosenType = type || selectedType;
        dispatch(setType(chosenType));
        dispatch(setSearchTerm(searchTermDisplayValue));
        dispatch(resetFilteredTypes());
        displayDropdown(false);
        return chosenType;
    }

    const searchTicketHandler = (type?: number) => {
        const chosenType = commonSearchHandler(type);
        const searchForTicketId = chosenType === searchTypeTicket.ticketId;
        if (searchTermDisplayValue.trim() !== '') {
            if (searchForTicketId) {
                dispatch(setSearchTermDisplayValue(''));
            }
            dispatch(resetFilteredTypes());
            history.push(`/tickets/${searchForTicketId ? searchTermDisplayValue.trim() : 'results'}`);
        }
    }

    const selectRecent = (recentPatient: RecentPatient) => {
        displayDropdown(false);
        dispatch(resetFilteredTypes());
        history.push('/patients/' + recentPatient.patientId);
    }


    const clearRecent = () => {
        displayDropdown(false);
        dispatch(clearRecentPatients());
    }

    const patientSearchTypes: DropdownItemModel[] = searchTypeFiltered
        .filter((typeItem: SearchType) => typeItem.category === SearchCategory.Patient)
        .map((typeItem: SearchType) => {
            return {
                onClick: (key) => searchPatientHandler(parseInt(key)),
                value: typeItem.type.toString(),
                label: t(typeItem.label)
            } as DropdownItemModel
        });

    const contactSearchTypes: DropdownItemModel[] = searchTypeFiltered
        .filter((typeItem: SearchType) => typeItem.category === SearchCategory.Contact)
        .map((typeItem: SearchType) => {
            return {
                onClick: (key) => searchContactHandler(parseInt(key)),
                value: typeItem.type.toString(),
                label: t(typeItem.label)
            } as DropdownItemModel
        });

    const ticketSearchTypes: DropdownItemModel[] = searchTypeFiltered
        .filter((typeItem: SearchType) => typeItem.category === SearchCategory.Ticket)
        .map((typeItem: SearchType) => {
            return {
                onClick: (key) => searchTicketHandler(parseInt(key)),
                value: typeItem.type.toString(),
                label: t(typeItem.label)
            } as DropdownItemModel
        });


    const getCategorizedItems = (): CategoryItemModel[] => {
        const emptySearchTypes = patientSearchTypes.length === 0 &&
            contactSearchTypes.length === 0 && ticketSearchTypes.length === 0;
        if (emptySearchTypes) {
            return initialFocusRender();
        }
        const items: CategoryItemModel[] = [];
        if (patientSearchTypes.length > 0) {
            items.push({
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.patients'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: SearchCategory.Patient
                },
                items: patientSearchTypes
            });
        }
        if (contactSearchTypes.length > 0) {
            items.push({
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.contacts'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: SearchCategory.Contact
                },
                items: contactSearchTypes
            });
        }
        if (ticketSearchTypes.length > 0) {
            items.push({
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.tickets'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: SearchCategory.Ticket
                },
                items: ticketSearchTypes
            });
        }

        return items;
    };

    const initialFocusRender = (): CategoryItemModel[] => {
        return [
            {
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.patients'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: SearchCategory.Patient
                },
                items: [
                    {label: t('search.search_type.patient_id'), value: 'item-1-1'},
                    {label: t('search.search_type.patient_name'), value: 'item-1-2'},
                    {label: t('search.search_type.dob'), value: 'item-1-3'},
                    {label: t('search.search_type.phone'), value: 'item-1-5'}
                ]
            },
            {
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.contacts'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: '2'
                },
                items: [
                    {
                        label: t('search.search_type.contact_name'),
                        value: 'item-2-1'
                    }
                ]
            },
            {
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.tickets'),
                    icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                    key: '3'
                },
                items: [
                    {
                        label: t('search.search_type.ticket_id'),
                        value: 'item-3-1'
                    },
                    {
                        label: t('search.search_type.patient_or_contact_name'),
                        value: 'item-3-2'
                    }
                ]
            }
        ];
    }

    const getItems = (): DropdownItemModel[] => {
        const items: DropdownItemModel[] = [];

        if (recentPatients.length > 0) {
            items.push({
                label: 'search.recent_searches',
                link: {
                    onClick: () => clearRecent(),
                    title: 'common.clear'
                },
                hasDivider: true,
                isTitle: true,
                value: '2'
            });

            recentPatients.forEach((patient: RecentPatient) => {
                const item = {
                    value: patient.patientId.toString(),
                    content: <RecentPatientDetails patient={patient} />,
                    onClick: (_) => selectRecent(patient)
                } as DropdownItemModel;

                items.push(item);
            });
        }

        return items;
    }

    const searchDropdownModel: DropdownModel = {
        title: t('search.search_title'),
        defaultValue: selectedType.toString(),
        categorizedItems: getCategorizedItems(),
        items: getItems()
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        displayDropdown(false);
    });

    return (
        <div className='relative z-10' ref={dropdownRef}>
            <div className='border-r border-l h-16 global-search-input'>
                <div className='flex flex-row h-full'>
                    <SearchInputField
                        wrapperClassNames={'h-16'}
                        inputClassNames={'border-none'}
                        iconOnClick={() => {handleSearch()}}
                        value={searchTermDisplayValue}
                        onFocus={() => displayDropdown(true)}
                        inputOnClick={() => displayDropdown(true)}
                        onChange={textChange}
                        onKeyDown={(e) => handleKey(e)}
                    />
                </div>
            </div>
            {dropdownDisplayed && <div className='absolute'>
                <Dropdown model={searchDropdownModel} />
            </div>}
        </div>
    );
}

export default SearchBar;
