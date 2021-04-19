import React, { useRef, useState } from 'react';
import { SearchType } from './models/search-type';
import { selectRecentPatients, selectSearchTypeFiltered, selectSelectedType, } from './store/search-bar.selectors';
import {
    changeFilteredTypes,
    changeTypeDown,
    changeTypeUp,
    clearRecentPatients,
    setType
} from './store/search-bar.slice';
import { searchPatients } from '../../services/search.service';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RecentPatient } from './models/recent-patient';
import RecentPatientDetails from './components/recent-patient-details';
import { searchType } from './constants/search-type';
import { keyboardKeys } from './constants/keyboard-keys';
import { clearPatients } from '@pages/patients/store/patients.slice';
import Dropdown from '../dropdown/dropdown';
import { CategoryItemModel, DropdownItemModel, DropdownModel } from '../dropdown/dropdown.models';
import './search-bar.scss';
import customHooks from '../../hooks/customHooks';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';

const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [dropdownDisplayed, displayDropdown] = useState(false);
    const [text, setText] = useState<string>('');
    const recentPatients = useSelector(selectRecentPatients);
    const selectedType = useSelector(selectSelectedType);
    const searchTypeFiltered = useSelector(selectSearchTypeFiltered);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const textChange = (value: string) => {
        displayDropdown(true);
        setText(value);
        dispatch(changeFilteredTypes(value));
    }
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case keyboardKeys.enter:
                search();
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
    const search = (type?: number) => {
        const chosenType = type || selectedType;
        dispatch(setType(chosenType));
        dispatch(clearPatients());
        displayDropdown(false);
        if (text !== '') {
            if (chosenType === searchType.patientId) {
                history.push('/patients/' + text);
            }
            else {
                dispatch(searchPatients(chosenType, text));
                history.push('/patients/results');
            }
        }
    }

    const selectRecent = (recentPatient: RecentPatient) => {
        displayDropdown(false);
        history.push('/patients/' + recentPatient.patientId);
    }
    const clearRecent = () => {
        displayDropdown(false);
        dispatch(clearRecentPatients());
    }

    const searchTypes = searchTypeFiltered.map((typeItem: SearchType) => {
        return {
            onClick: (key) => search(parseInt(key)),
            value: typeItem.type.toString(),
            label: t(typeItem.label)
        } as DropdownItemModel;
    });

    const getCategorizedItems = (): CategoryItemModel[] => {
        const items: CategoryItemModel[] = [];
        if (searchTypes.length > 0) {
            items.push({
                itemsCssClass: 'w-72',
                category: {
                    text: t('search.categories.patients'),
                    icon: <SvgIcon type={Icon.Placeholder} className='small' fillClass='' />,
                    key: '1'
                },
                items: searchTypes
            });
        }
        items.push({
            itemsCssClass: 'w-72',
            category: {
                text: t('search.categories.contacts'),
                icon: <SvgIcon type={Icon.Placeholder} className='small' fillClass='' />,
                key: '2'
            },
            items: [
                {
                    label: t('search.search_type.contact_name'),
                    value: 'item-2-1'
                }
            ]
        });
        items.push({
            itemsCssClass: 'w-72',
            category: {
                text: t('search.categories.tickets'),
                icon: <SvgIcon type={Icon.Placeholder} className='small' fillClass='' />,
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
        });
        return items;
    };

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
                        iconOnClick={() => { search() }}
                        value={text}
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
