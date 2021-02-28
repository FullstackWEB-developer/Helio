import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isNavigationExpandedSelector } from '../store/layout.selectors';
import { bool } from 'aws-sdk/clients/redshiftdata';
import withErrorLogging from '../../HOC/with-error-logging';
interface NavigationItemProps {
    title: string,
    link: string,
    icon: React.ReactNode,
    isSelected: bool
}

const NavigationItem = ({ title, link, icon, isSelected }: NavigationItemProps) => {
    const { t } = useTranslation();
    const isNavigationExpanded = useSelector(isNavigationExpandedSelector);

    let content = (<div className='border-b p-5 pl-7 items-center flex w-full md:w-60'>
        <div className='pr-4'>
            {icon}
        </div>
        <Link to={link} className={'hover:text-gray-400 ' + (isSelected ? 'font-medium' : 'font-regular')}>{t(title)}</Link>
    </div>);

    if (!isNavigationExpanded) {
        content = (<div className='border-b p-5 pl-7 hidden md:block cursor-pointer'>
            <Link to={link} className='text-gray-500 hover:text-gray-400'>
                {icon}</Link>
        </div>);
    }

    return (content);
}

export default withErrorLogging(NavigationItem);
