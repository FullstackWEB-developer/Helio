import React, {useRef, useState} from 'react';
import {SearchType} from './models/search-type';
import {useTranslation} from 'react-i18next';
import {keyboardKeys} from './constants/keyboard-keys';
import Dropdown from '../dropdown/dropdown';
import {CategoryItemModel, DropdownItemModel, DropdownModel} from '../dropdown/dropdown.models';
import customHooks from '../../hooks/customHooks';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import {searchTypes} from './constants/search-type-const';
import classnames from 'classnames';
import './searchbox.scss';
import {SearchCategory} from '@components/search-bar/constants/search-type-const';
import {searchType} from './constants/search-type';

interface SearchBoxProps {
    className?: string;
    dropdownClassName?: string;
    onTextChange?: (value: string) => void;
    onSearch?: (type: number, value: string) => void;
}

const SearchBox = ({className, dropdownClassName, ...props}: SearchBoxProps) => {
    const {t} = useTranslation();
    const [dropdownDisplayed, displayDropdown] = useState(false);
    const [text, setText] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number>(1);
    const [searchTypeFiltered, setSearchTypeFiltered] = useState<SearchType[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const changeFilteredTypes = (value: string) => {
        const searchTypeResult = value !== ''
            ? searchTypes.filter(type => new RegExp(type.regex).test(value))
            : [];

        const selectedTypeResult = searchTypeFiltered.length > 0
            ? searchTypeFiltered
                .reduce((acc, current) => {return acc.priority < current.priority ? acc : current})
                .type
            : 1;
        setSearchTypeFiltered(searchTypeResult);
        setSelectedType(selectedTypeResult);
    }

    const textChange = (value: string) => {
        displayDropdown(true);
        setText(value);
        changeFilteredTypes(value);
        if (props.onTextChange) {
            props.onTextChange(value);
        }

    }
    const changeTypeUp = () => {
        const findTypeIndex = searchTypeFiltered.findIndex(type => type.type === selectedType) ?? 0;
        const newType = findTypeIndex === 0
            ? searchTypeFiltered[searchTypeFiltered.length - 1]
            : searchTypeFiltered[findTypeIndex - 1];
        setSelectedType(newType.type);
    }
    const changeTypeDown = () => {
        const findTypeIndex = searchTypeFiltered.findIndex(type => type.type === selectedType) ?? 0;
        const newType = findTypeIndex < searchTypeFiltered.length - 1
            ? searchTypeFiltered[findTypeIndex + 1]
            : searchTypeFiltered[0];
        setSelectedType(newType.type);
    }
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case keyboardKeys.enter:
                search();
                displayDropdown(false);
                break;
            case keyboardKeys.arrowUp:
                changeTypeUp();
                break;
            case keyboardKeys.arrowDown:
                changeTypeDown();
                break;
        }
    }
    const search = (type?: number) => {
        if (props.onSearch) {
            props.onSearch(type || selectedType, text);
        }
        displayDropdown(false);
    }

    const searchTypesDropDownModel = searchTypeFiltered
        .filter((typeItem: SearchType) => typeItem.type === searchType.patientId || typeItem.type === searchType.patientName)
        .map((typeItem: SearchType) => {
        return {
            onClick: (key) => search(parseInt(key)),
            value: typeItem.type.toString(),
            label: t(typeItem.label)
        } as DropdownItemModel;
    });

    const initialPatientSearchType = [
        {label: 'search.search_type.patient_id', value: 'item-1-1'},
        {label: 'search.search_type.patient_name', value: 'item-1-2'}
    ];

    const getCategorizedItems = (): CategoryItemModel[] => {
        const items: CategoryItemModel[] = [];
        items.push({
            itemsCssClass: 'w-72',
            category: {
                text: 'search.categories.patients',
                icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />,
                key: SearchCategory.Patient
            },
            items: searchTypesDropDownModel.length > 0 ? searchTypesDropDownModel : initialPatientSearchType
        });
        return items;
    };

    const searchDropdownModel: DropdownModel = {
        title: t('search.search_title'),
        defaultValue: selectedType.toString(),
        categorizedItems: getCategorizedItems(),
        items: []
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        displayDropdown(false);
    });

    return (
        <div className='w-full' ref={dropdownRef}>
            <div className={classnames('h-16', className)}>
                <div className='flex flex-row h-full'>
                    <SearchInputField
                        wrapperClassNames={'h-16'}
                        inputClassNames={'border-none'}
                        iconOnClick={() => {search()}}
                        value={text}
                        disableSearchIcon
                        onFocus={() => displayDropdown(true)}
                        inputOnClick={() => displayDropdown(true)}
                        onChange={textChange}
                        onKeyDown={(e) => handleKey(e)}
                    />
                </div>
            </div>
            {dropdownDisplayed && <div className={classnames('absolute', dropdownClassName)}>
                <Dropdown model={searchDropdownModel} />
            </div>}
        </div>
    );
}

export default SearchBox;
