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

    let content = (<div className='border-b items-center flex h-14 w-62'>
        <div className='pl-8.5'>
            {icon}
        </div>
        <Link to={link} className={'hover:text-gray-400 pl-4.5 ' + (isSelected ? 'subtitle2' : 'body2-medium')}>{t(title)}</Link>
    </div>);

    if (!isNavigationExpanded) {
        content = (<div className='border-b h-14 w-20  hidden md:block cursor-pointer'>
            <Link to={link} className='text-gray-500 hover:text-gray-400 h-full flex items-center justify-center'>
                {icon}</Link>
        </div>);
    }

    return (content);
}

export default withErrorLogging(NavigationItem);
