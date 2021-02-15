import { ReactComponent as DashboardIcon } from '../icons/Icon-Dashboard-24px.svg';
import { ReactComponent as MyTicketsIcon } from '../icons/Icon-Ticket-24px.svg';
import { ReactComponent as AllTicketsIcon } from '../icons/Icon-Tickets-24px.svg';
import { ReactComponent as ContactsIcon } from '../icons/Icon-Contacts-24px.svg';
import { ReactComponent as EmailIcon } from '../icons/Icon-Email-24px.svg';
import { ReactComponent as SmsIcon } from '../icons/Icon-SMS-24px.svg';
import NavigationItem from './components/navigation-item';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
const Navigation = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isActive = (link: string): boolean => {
        return (location && location.pathname === link)
    };

    var menuItems = [
        {
            title: t('navigation.dashboard'),
            link: "/dashboard",
            id: "navigation-dashboard",
            icon: <DashboardIcon></DashboardIcon>
        }, {
            title: t('navigation.my_tickets'),
            link: "/my_tickets",
            id: "navigation-my_tickets",
            icon: <MyTicketsIcon></MyTicketsIcon>
        }, {
            title: t('navigation.all_tickets'),
            link: "/tickets",
            id: "navigation-tickets",
            icon: <AllTicketsIcon></AllTicketsIcon>
        }, {
            title: t('navigation.contacts'),
            link: "/contacts",
            id: "navigation-contacts",
            icon: <ContactsIcon></ContactsIcon>
        }, {
            title: t('navigation.email'),
            link: "/email",
            id: "navigation-email",
            icon: <EmailIcon></EmailIcon>
        }, {
            title: t('navigation.sms'),
            link: "/sms",
            id: "navigation-sms",
            icon: <SmsIcon></SmsIcon>
        }
    ];

    const items = menuItems.map((item, index) => {
        const isSelected = isActive(item.link);
        return <div key={index} className={isSelected ? "border-l-4 border-primary bg-gray-100" : ""}>
            <NavigationItem isSelected={isSelected} key={index} icon={item.icon} link={item.link} title={item.title}></NavigationItem>
        </div>
    });

    return (
        <nav className="h-full border-r">
            {items}
        </nav>
    );
}

export default Navigation;
