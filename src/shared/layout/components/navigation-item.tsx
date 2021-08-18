import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {isNavigationExpandedSelector} from '../store/layout.selectors';
import withErrorLogging from '../../HOC/with-error-logging';
import React, {useState} from 'react';
import './navigation-item.scss';
import {BadgeNumber} from '@icons/BadgeNumber';
import {toggleTicketListFilter} from '@pages/tickets/store/tickets.slice';
import {setNavigationChanged} from '@shared/store/app/app.slice';

interface NavigationItemProps {
    title: string,
    link: string,
    icon: React.ReactNode,
    isSelected: boolean
}

const NavigationItem = ({title, link, icon, isSelected}: NavigationItemProps) => {
    const {t} = useTranslation();
    const isNavigationExpanded = useSelector(isNavigationExpandedSelector);
    const [displayBadge, setDisplayBadge] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = () => {
        dispatch(toggleTicketListFilter(false));
        dispatch(setNavigationChanged(true));
        setTimeout(() => {
            dispatch(setNavigationChanged(false));
        }, 0);
    }

    return (<div className='flex flex-row'>
        {<div className={'w-1.5 ' + (isSelected ? 'bg-green-400' : '')}/>}
        <Link to={link} onClick={navigate}>
        <div className={(isSelected ? 'subtitle2' : 'body2-medium')}>
            <div
                className={'items-center flex h-14  navigation-item-active cursor-pointer ' + (isNavigationExpanded ? 'w-62' : 'w-20')}>
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
        </div>
        </Link>
    </div>);
}

export default withErrorLogging(NavigationItem);
