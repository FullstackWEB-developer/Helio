import React, { useState } from 'react';
import { SearchType } from './models/search-type';
import { ReactComponent as SearchIcon } from '../../icons/Icon-Search-16px.svg';
import {
    selectRecentPatients,
    selectSearchTypeFiltered,
    selectSelectedType,
    selectTerm
} from './store/search-bar.selectors';
import { changeValue, changeFilteredTypes, clearRecentPatients, changeTypeDown, changeTypeUp } from './store/search-bar.slice';
import { searchPatients } from '../../services/search.service';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RecentPatient } from './models/recent-patient';
import RecentPatientDetails from './components/recent-patient-details';
import { searchType } from './constants/search-type';
import { keyboardKeys } from './constants/keyboard-keys';
import { clearPatients } from '../../../pages/patients/store/patients.slice';
import Dropdown from '../dropdown/dropdown';
import {CategoryItemModel, DropdownItemModel, DropdownModel} from '../dropdown/dropdown.models';
import {ReactComponent as PlaceholderIcon} from '../../icons/Icon-Placeholder-16px.svg';
import './search-bar.scss';
const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [hideDropdown, setDropdown] = useState(true);
    const recentPatients = useSelector(selectRecentPatients);
    const selectedType = useSelector(selectSelectedType);
    const searchTypeFiltered = useSelector(selectSearchTypeFiltered);
    const searchTerm = useSelector(selectTerm);

    const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setDropdown(false);
        dispatch(changeValue(text));
        dispatch(changeFilteredTypes(text))
    }
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case keyboardKeys.enter:
                search();
                setDropdown(true);
                break;
            case keyboardKeys.arrowUp:
                dispatch(changeTypeUp());
                break;
            case keyboardKeys.arrowDown:
                dispatch(changeTypeDown());
                break;
        }
    }
    const search = (type?: number) => {
        const chosenType = type || selectedType;
        dispatch(clearPatients());
        if (searchTerm !== '') {
            if (chosenType === searchType.patientId) {
                history.push('/patients/' + searchTerm);
            }
            else {
                dispatch(searchPatients(chosenType, searchTerm));
                history.push('/patients/results');
            }
        }
    }
    const onblur = () => {
        setTimeout(() => setDropdown(true), 100)
    }
    const selectRecent = (recentPatient: RecentPatient) => {
        history.push('/patients/' + recentPatient.patientId);
    }
    const clearRecent = () => {
        dispatch(clearRecentPatients());
    }

    const searchTypes = searchTypeFiltered.map((typeItem: SearchType) => {
        return {
            onClick: (key) => search(parseInt(key)),
            key: typeItem.type.toString(),
            text: t(typeItem.label)
        } as DropdownItemModel;
    });

    const getCategorizedItems = () : CategoryItemModel[] => {
        const items: CategoryItemModel[] = [];
        if (searchTypes.length > 0) {
            items.push({
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.patients'),
                    icon: <PlaceholderIcon/>,
                    key: '1'
                },
                items: searchTypes
            });
        }
        items.push( {
            itemsCssClass: 'w-72',
            category: {
                text: t('search.categories.contacts'),
                icon: <PlaceholderIcon/>,
                key: '2'
            },
            items: [
                {
                    text: t('search.search_type.contact_name'),
                    key: 'item-2-1'
                }
            ]
        });
        items.push({
            itemsCssClass: 'w-72',
            category: {
                text: t('search.categories.tickets'),
                icon: <PlaceholderIcon/>,
                key: '3'
            },
            items: [
                {
                    text:  t('search.search_type.ticket_id'),
                    key: 'item-3-1'
                },
                {
                    text:  t('search.search_type.patient_or_contact_name'),
                    key: 'item-3-2'
                }
            ]
        });
        return items;
    };

    const getItems = () : DropdownItemModel[] => {
        const items : DropdownItemModel[] = [];

        if (recentPatients.length > 0) {
            items.push({
                text: 'search.recent_searches',
                link: {
                    onClick :() => clearRecent(),
                    title: 'common.clear'
                },
                hasDivider: true,
                isTitle: true,
                key: '2'
            });

            recentPatients.forEach((patient: RecentPatient) => {
                const item = {
                    key: patient.patientId.toString(),
                    content: <RecentPatientDetails patient={patient}/>,
                    onClick: (_) => selectRecent(patient)
                } as DropdownItemModel;

                items.push(item);
            });
        }

        return items;
    }

    const searchDropdownModel : DropdownModel = {
        title : t('search.search_title'),
        selectedKey : selectedType.toString(),
        categorizedItems : getCategorizedItems(),
        items: getItems()
    }

    return (
        <div className='relative'>
            <div className='border-r border-l px-4 h-16 global-search-input'>
                <input type='text' className='focus:outline-none h-full w-full' placeholder={t('search.placeholder')}
                    onFocus={() => setDropdown(false)} onBlur={() => onblur()} onClick={() => setDropdown(false)}
                    onChange={(e) => textChange(e)} onKeyDown={(e) => handleKey(e)}
                    value={searchTerm} />
                <span className={'absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer'}>
                    <SearchIcon onClick={() => search()} />
                </span>
            </div>
            {!hideDropdown && <div className='absolute'>
                <Dropdown model={searchDropdownModel} />
            </div>}
        </div>
    );
}

export default SearchBar;
