import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {isNavigationExpandedSelector} from '../store/layout.selectors';
import {bool} from 'aws-sdk/clients/redshiftdata';
import withErrorLogging from '../../HOC/with-error-logging';
import React, {useState} from 'react';
import './navigation-item.scss';
import {BadgeNumber} from '@icons/BadgeNumber';

interface NavigationItemProps {
    title: string,
    link: string,
    icon: React.ReactNode,
    isSelected: bool
}

const NavigationItem = ({title, link, icon, isSelected}: NavigationItemProps) => {
    const {t} = useTranslation();
    const isNavigationExpanded = useSelector(isNavigationExpandedSelector);
    const [displayBadge, setDisplayBadge] = useState<boolean>(false);

    return (<div className='flex flex-row'>
        {<div className={'w-1.5 ' + (isSelected ? 'bg-green-400' : '')}/>}
        <Link to={link} className={(isSelected ? 'subtitle2' : 'body2-medium')}>
            <div
                className={'items-center flex h-14  navigation-item-active ' + (isNavigationExpanded ? 'w-62' : 'w-20')}>
                <div>{icon}</div>
                {isNavigationExpanded &&
                <div className='pl-4 w-full flex flex-row items-center justify-between'>
                    <div className=''>
                        {t(title)}
                    </div>
                    <div className='w-16 justify-end'>
                        {displayBadge && <BadgeNumber type='yellow'/>}
                    </div>
                </div>
                }
            </div>
        </Link>
    </div>);
}

export default withErrorLogging(NavigationItem);
