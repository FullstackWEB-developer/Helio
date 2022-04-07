import Collapsible from '@components/collapsible';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';
import { Link } from 'react-router-dom';
import {ConfigurationMenuItems} from '../utils/configuration-menu-items';
import './configurations-menu.scss';

interface ConfigurationsMenuProps {
    activeUrl?: string;
}

const ConfigurationsMenu = ({activeUrl}: ConfigurationsMenuProps) => {
    const {t} = useTranslation();
    const configurationMenu = ConfigurationMenuItems;
    const getClassName = (url: string) => {
        return classnames('flex items-center cursor-pointer menu-item', {
            'link': url === activeUrl,
        });

    }
    return (
        <div className='configuration-menu h-full'>
            <h5 className='pb-6'>{t('configuration.title')}</h5>
            {configurationMenu.map(item => {
                if(item.children){
                    return <Collapsible key={item.id} title={t(item.title)} isOpen={true} headerClassName={'h-10'} titleClassName={'subtitle2'}>
                                {item.children.map(child => {
                                    return <Link to={`/configurations/${child.url}`}>
                                                <div key={child.id} id={child.id} className={`${getClassName(child.url)} body2 pl-6 h-8`}>{t(child.title)}</div>
                                            </Link>
                                })}
                            </Collapsible>
                }else{
                    return <Link to={`/configurations/${item.url}`}>
                                <div key={item.id} id={item.id} className={`${getClassName(item.url)} subtitle2 h-10`}>{t(item.title)}</div>
                            </Link>
                }
            })}
        </div>
    );
}

export default ConfigurationsMenu;
