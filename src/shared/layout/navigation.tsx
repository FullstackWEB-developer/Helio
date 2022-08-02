import NavigationItem from './components/navigation-item';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import {toggleNavigation} from './store/layout.slice';
import React, {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BlackListsPath, ConfigurationsPath, ReportsPath, TicketsPath, UsersPath} from '@app/paths';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import './navigation.scss';
import {selectUnreadSmsMessages, selectUnreadTeamSms} from '@pages/sms/store/sms.selectors';
import {selectUnreadEmails, selectUnreadTeamEmails} from '@pages/email/store/email.selectors';
import { selectUnreadTeamTickets, selectUnreadTickets } from '@pages/tickets/store/tickets.selectors';

const Navigation = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const isActive = (link: string): boolean => {
        return (location && location.pathname.startsWith(link))
    };

    const unreadSMSList = useSelector(selectUnreadSmsMessages);
    const unreadEmails = useSelector(selectUnreadEmails);
    const unreadTickets = useSelector(selectUnreadTickets);
    const unreadTeamSMSList = useSelector(selectUnreadTeamSms);
    const unreadTeamEmails = useSelector(selectUnreadTeamEmails);
    const unreadTeamTickets = useSelector(selectUnreadTeamTickets);

    const unreadEmailCount = useMemo(() => {
        return unreadEmails;
    }, [unreadEmails]);

    const unreadSMSListCount = useMemo(() => {
        return unreadSMSList;
    }, [unreadSMSList]);

    const unreadTicketsCount = useMemo(() => {
        return unreadTickets;
    }, [unreadTickets]);

    const unreadTeamEmailCount = useMemo(() => {
        return unreadTeamEmails;
    }, [unreadTeamEmails]);

    const unreadTeamSMSListCount = useMemo(() => {
        return unreadTeamSMSList;
    }, [unreadTeamSMSList]);

    const unreadTeamTicketsCount = useMemo(() => {
        return unreadTeamTickets;
    }, [unreadTeamTickets]);

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
            icon: <SvgIcon type={Icon.Tickets} fillClass='active-item-icon' />,
            displayBadge: unreadTicketsCount > 0 || unreadTeamTicketsCount > 0,
            badgeValue: unreadTicketsCount,
            teamValue: unreadTeamTicketsCount,
            myBadgeLabel: t('common.my_tickets'),
            teamBadgeLabel: t('common.team_tickets')
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
            displayBadge: unreadSMSListCount > 0 || unreadTeamSMSListCount > 0,
            badgeValue: unreadSMSListCount,
            teamValue: unreadTeamSMSListCount,
            myBadgeLabel: t('common.my_sms'),
            teamBadgeLabel: t('common.team_sms')
        },
        {
             title: t('navigation.email'),
             link: '/email',
             id: 'navigation-email',
             icon: <SvgIcon type={Icon.Email} fillClass='active-item-icon' />,
             displayBadge: unreadEmailCount > 0 || unreadTeamEmailCount > 0,
             badgeValue: unreadEmailCount,
             teamValue: unreadTeamEmailCount,
             myBadgeLabel: t('common.my_emails'),
             teamBadgeLabel: t('common.team_emails')
        },
        {
            title: t('navigation.reports'),
            link: ReportsPath,
            id: 'navigation-reports',
            icon: <SvgIcon type={Icon.Reports} fillClass='active-item-icon' />,
            permission: 'Reports.Access'
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
        }, {
            title: t('navigation.configurations'),
            link: `${ConfigurationsPath}`,
            id: 'navigation-configurations',
            icon: <SvgIcon type={Icon.Configurations} fillClass='active-item-icon' />,
            permission: 'Configurations.Access'
        }
    ];

    const items = React.Children.toArray(menuItems.map((item) => {
        const isSelected = isActive(item.link);
        return (
            <NavigationItem
                isSelected={isSelected}
                icon={item.icon}
                link={item.link}
                title={item.title}
                displayBadge={item.displayBadge}
                badgeValue={item.badgeValue}
                teamValue={item.teamValue}
                permission={item.permission}
                myBadgeLabel={item.myBadgeLabel}
                teamBadgeLabel={item.teamBadgeLabel}
            />
        );
    }));

    return (
        <nav className='flex flex-col h-full navigation'>
            <div className='flex items-center h-16 border-r pl-7'>
                <SvgIcon type={Icon.Menu} className='cursor-pointer' fillClass='white-icon' onClick={() => dispatch(toggleNavigation())} />
            </div>
            <div className='border-t items-border-top'>
                {items}
            </div>
            <div className='flex-grow border-r' />
        </nav>
    );
}

export default Navigation;
