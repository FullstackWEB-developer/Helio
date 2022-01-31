import NavigationItem from './components/navigation-item';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import {toggleNavigation} from './store/layout.slice';
import React, {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BlackListsPath, TicketsPath, UsersPath} from '@app/paths';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import './navigation.scss';
import {selectUnreadSMSList} from '@shared/store/app-user/appuser.selectors';
import {selectUnreadEmails} from '@pages/email/store/email.selectors';

const Navigation = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const isActive = (link: string): boolean => {
        return (location && location.pathname === link)
    };

    const unreadSMSList = useSelector(selectUnreadSMSList);
    const unreadEmails = useSelector(selectUnreadEmails);

    const unreadEmailCount = useMemo(() => {
        return unreadEmails.reduce((a, b) => a + b.count, 0);
    }, [unreadEmails]);

    const menuItems = [
        {
            title: t('navigation.dashboard'),
            link: '/dashboard',
            id: 'navigation-dashboard',
            icon: <SvgIcon type={Icon.Dashboard} fillClass='active-item-icon' />
        }, {
            title: t('navigation.tickets'),
            link: TicketsPath,
            id: 'navigation-tickets',
            icon: <SvgIcon type={Icon.Tickets} fillClass='active-item-icon' />
        }, {
            title: t('navigation.contacts'),
            link: '/contacts',
            id: 'navigation-contacts',
            icon: <SvgIcon type={Icon.Contacts} fillClass='active-item-icon' />
        }, {
            title: t('navigation.calls'),
            link: '/calls',
            id: 'navigation-calls',
            icon: <SvgIcon type={Icon.Phone} fillClass='active-item-icon' />
        }, {
            title: t('navigation.chat'),
            link: '/chats',
            id: 'navigation-chat',
            icon: <SvgIcon type={Icon.Chat} fillClass='active-item-icon' />
        }, {
            title: t('navigation.sms'),
            link: '/sms',
            id: 'navigation-sms',
            icon: <SvgIcon type={Icon.Sms} fillClass='active-item-icon' />,
            displayBadge: true,
            badgeValue: unreadSMSList?.length
        },
        {
             title: t('navigation.email'),
             link: '/email',
             id: 'navigation-email',
             icon: <SvgIcon type={Icon.Email} fillClass='active-item-icon' />,
             displayBadge: unreadEmailCount > 0,
             badgeValue: unreadEmailCount
        },
        {
            title: t('navigation.users'),
            link: UsersPath,
            id: 'navigation-users',
            icon: <SvgIcon type={Icon.Users} fillClass='active-item-icon' />,
            permission: 'Users.Access'
        }, {
            title: t('navigation.blacklists'),
            link: BlackListsPath,
            id: 'navigation-blacklists',
            icon: <SvgIcon type={Icon.Blacklist} fillClass='active-item-icon' />,
            permission: 'BlockedAccess.Access'
        }
    ];

    const items = React.Children.toArray(menuItems.map((item) => {
        const isSelected = isActive(item.link);
        const icon = React.cloneElement(item.icon, {pathClass: (isSelected ? 'navigation-active-icon-color' : 'navigation-inactive-icon-color')})
        return (
            <NavigationItem
                isSelected={isSelected}
                icon={icon}
                link={item.link}
                title={item.title}
                displayBadge={item.displayBadge}
                badgeValue={item.badgeValue}
                permission={item.permission}
            />
        );
    }));

    return (
        <nav className='flex flex-col h-full'>
            <div className='flex items-center h-16 border-r pl-7'>
                <SvgIcon type={Icon.Menu} className='cursor-pointer' fillClass='active-item-icon' onClick={() => dispatch(toggleNavigation())} />
            </div>
            <div className='border-t'>
                {items}
            </div>
            <div className='flex-grow border-r' />
        </nav>
    );
}

export default Navigation;
