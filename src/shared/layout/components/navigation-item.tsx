import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { isNavigationExpandedSelector } from '../store/layout.selectors';
interface NavigationItemProps {
    title: string,
    link: string,
    icon: React.ReactNode
}

const NavigationItem = ({ title, link, icon }: NavigationItemProps) => {
    const { t } = useTranslation();
    const isNavigationExpanded = useSelector((state: RootState) => isNavigationExpandedSelector(state));

    let content = (<div className="border-b p-5 pl-7 items-center flex w-full md:w-60">
        <div className="pr-4">
            {icon}
        </div>
        <Link to={link} className="font-semibold text-gray-500 hover:text-gray-400">{t(title)}</Link>
    </div>);

    if (!isNavigationExpanded) {
        content = (<div className="border-b p-5 pl-7 hidden md:block cursor-pointer">
            <Link to={link} className="font-semibold text-gray-500 hover:text-gray-400">
                {icon}</Link>
        </div>);
    }

    return (content);
}

export default NavigationItem;