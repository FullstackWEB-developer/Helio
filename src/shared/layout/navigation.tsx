import NavigationItem from './components/navigation-item';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import {ReactComponent as MenuIcon} from '@icons/Icon-Menu-24px.svg';
import {toggleNavigation} from './store/layout.slice';
import React from 'react';
import {useDispatch} from 'react-redux';
import {TicketsPath} from '../../app/paths';
import {IconPhone} from '@icons/IconPhone';
import './navigation.scss';
import {IconDashboard} from '@icons/IconDashboard';
import {IconTicket} from '@icons/IconTicket';
import {IconContacts} from '@icons/IconContacts';
import {IconEmail} from '@icons/IconEmail';
import {IconSms} from '@icons/IconSms';
import {IconChat} from '@icons/IconChat';

const Navigation = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const isActive = (link: string): boolean => {
        return (location && location.pathname === link)
    };

    const menuItems = [
        {
            title: t('navigation.dashboard'),
            link: '/dashboard',
            id: 'navigation-dashboard',
            icon: <IconDashboard/>
        }, {
            title: t('navigation.tickets'),
            link: TicketsPath,
            id: 'navigation-tickets',
            icon: <IconTicket/>
        }, {
            title: t('navigation.contacts'),
            link: '/contacts',
            id: 'navigation-contacts',
            icon: <IconContacts/>
        }, {
            title: t('navigation.calls'),
            link: '/calls',
            id: 'navigation-calls',
            icon: <IconPhone rectClass='navigation-icon-rect'/>
        }, {
            title: t('navigation.chat'),
            link: '/chat',
            id: 'navigation-chat',
            icon: <IconChat rectClass='navigation-icon-rect'/>
        }, {
            title: t('navigation.sms'),
            link: '/sms',
            id: 'navigation-sms',
            icon: <IconSms/>
        }, {
            title: t('navigation.email'),
            link: '/email',
            id: 'navigation-email',
            icon: <IconEmail/>
        }
    ];

    const items = menuItems.map((item, index) => {
        const isSelected = isActive(item.link);
        const icon = React.cloneElement(item.icon, {pathClass: (isSelected ? 'navigation-active-icon-color' : 'navigation-inactive-icon-color')})
        return <div key={index}
                    className={`hover:bg-secondary-50 hover:border-0 ${isSelected ? ' bg-secondary-50 ' : 'border-r'}`}>
            <NavigationItem isSelected={isSelected} key={index} icon={icon} link={item.link} title={item.title}/>
        </div>
    });

    return (
        <nav className='h-full flex flex-col'>
            <div className='h-16 pl-7 flex items-center'>
                <MenuIcon className='cursor-pointer' onClick={() => dispatch(toggleNavigation())}/>
            </div>
            <div className='border-t'>
                {items}
            </div>
            <div className='border-r flex-grow'/>
        </nav>
    );
}

export default Navigation;
