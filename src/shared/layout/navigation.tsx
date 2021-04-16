import NavigationItem from './components/navigation-item';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import {toggleNavigation} from './store/layout.slice';
import React from 'react';
import {useDispatch} from 'react-redux';
import {TicketsPath} from '../../app/paths';
import './navigation.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

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
            icon: <SvgIcon type={Icon.Dashboard} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.tickets'),
            link: TicketsPath,
            id: 'navigation-tickets',
            icon: <SvgIcon type={Icon.Tickets} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.contacts'),
            link: '/contacts',
            id: 'navigation-contacts',
            icon: <SvgIcon type={Icon.Contacts} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.calls'),
            link: '/calls',
            id: 'navigation-calls',
            icon: <SvgIcon type={Icon.Phone} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.chat'),
            link: '/chat',
            id: 'navigation-chat',
            icon: <SvgIcon type={Icon.Chat} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.sms'),
            link: '/sms',
            id: 'navigation-sms',
            icon: <SvgIcon type={Icon.Sms} fillClass='active-item-icon'/>
        }, {
            title: t('navigation.email'),
            link: '/email',
            id: 'navigation-email',
            icon: <SvgIcon type={Icon.Email} fillClass='active-item-icon'/>
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
            <div className='h-16 pl-7 flex items-center border-r'>
                <SvgIcon type={Icon.Menu} className='cursor-pointer' fillClass='active-item-icon' onClick={() => dispatch(toggleNavigation())}/>
            </div>
            <div className='border-t'>
                {items}
            </div>
            <div className='border-r flex-grow'/>
        </nav>
    );
}

export default Navigation;
