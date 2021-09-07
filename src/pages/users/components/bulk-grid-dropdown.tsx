import Dropdown, {DropdownModel} from '@components/dropdown';
import {useComponentVisibility} from '@shared/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectProviderList, selectRoleList} from '@shared/store/lookups/lookups.selectors';
import {useMemo} from 'react';
import utils from '@shared/utils/utils';
import SvgIcon, {Icon} from '@components/svg-icon';
import {BulkGridDropdownType} from '../models/bulk-grid-dropdown-type.enum';
import {clearSelectedUserProviderMapping, setSelectedUserProviderMapping, setSelectedUserRole} from '../store/users.slice';

const BulkGridDropdown = ({userId, purpose, storedRole, storedProviderMapping}: {
    userId: string, purpose: BulkGridDropdownType,
    storedRole: string[], storedProviderMapping?: string
}) => {

    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const dispatch = useDispatch();
    const chevronPosition = useRef<HTMLDivElement>(null);
    const userRoleList = useSelector(selectRoleList);
    const [selectedRole, setSelectedRole] = useState<string>();
    const [selectedProvider, setSelectedProvider] = useState<string>();
    const {t} = useTranslation();

    const roleOptions = useMemo(() => utils.parseOptions(userRoleList,
        item => item.name,
        item => item.name
    ), [userRoleList]);

    const providers = useSelector(selectProviderList);
    const providerOptions = useMemo(() => utils.parseOptions(providers,
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString()
    ), [providers]);

    useEffect(() => {
        if (storedRole.length > 0) {
            setSelectedRole(storedRole[0]);
        }
        if (storedProviderMapping) {
            setSelectedProvider(storedProviderMapping);
        }
    }, []);

    const determineDropdownPosition = () => {
        let right = 0;
        const rightmostPoint = elementRef.current?.getBoundingClientRect()?.right;
        const chevronRightPoint = chevronPosition.current?.getBoundingClientRect()?.right;
        if (rightmostPoint && chevronRightPoint) {
            right = rightmostPoint - chevronRightPoint;
        }
        return {
            right: `${right}px`
        }
    }

    const roleDropdownModel: DropdownModel = {
        isSearchable: false,
        items: roleOptions,
        onClick: (role: string) => {
            setSelectedRole(role);
            setIsVisible(false);
            dispatch(setSelectedUserRole({userId, role}));
        }
    };

    const providerMappingDropdownModel: DropdownModel = {
        isSearchable: true,
        items: providerOptions,
        onClick: (ehrMapping: string) => {
            setIsVisible(false);
            setSelectedProvider(ehrMapping);
            dispatch(setSelectedUserProviderMapping({userId, providerId: ehrMapping}));
        }
    }

    const displayProviderName = () => {
        return selectedProvider ? providerOptions.find(o => o.value === selectedProvider)?.label : '';
    }

    const clearProviderMapping = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProvider('');
        dispatch(clearSelectedUserProviderMapping(userId));
    }

    return (
        <div ref={elementRef} onClick={(e) => {e.stopPropagation(); setIsVisible(!isVisible)}}
            className='cursor-pointer relative col-span-1'>
            <div className='flex flex-row'>
                {
                    purpose === BulkGridDropdownType.Role ?
                        <div className='bulk-user-grid-role-value'>{selectedRole || t('users.bulk_section.pick_a_role')}</div> :
                        <div className='bulk-user-grid-ehr-value'>{displayProviderName() || t('users.bulk_section.undefined_mapping')}</div>
                }
                <div className='pl-3' ref={chevronPosition} >
                    {
                        displayProviderName() ? <SvgIcon type={Icon.Clear} className='cursor-pointer' fillClass='active-item-icon' onClick={clearProviderMapping} /> :
                            <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
                    }
                </div>
            </div>

            {
                isVisible &&
                <div onClick={e => e.stopPropagation()}
                    className='absolute w-48 z-10 top-10'
                    style={determineDropdownPosition()}>
                    <Dropdown model={purpose === BulkGridDropdownType.Role ? roleDropdownModel : providerMappingDropdownModel} />
                </div>
            }
        </div>
    );
}

export default BulkGridDropdown;