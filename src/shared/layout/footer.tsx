import {ReactComponent as ArrowDownIcon} from '../icons/Icon-Arrow-down-16px.svg';
import {ReactComponent as ArrowUpIcon} from '../icons/Icon-Arrow-up-16px.svg';
import {useTranslation} from 'react-i18next';
import {ReactComponent as CalendarIcon} from '../icons/Icon-Calendar-24px.svg';
import './footer.scss';
import {useDispatch, useSelector} from 'react-redux';
import {toggleHotspots, toggleStatusBar} from './store/layout.slice';
import {selectIsStatusBarVisible} from './store/layout.selectors';
import {useState} from 'react';

const Footer = () => {
    const {t} = useTranslation();
    const isStatusBarVisible = useSelector(selectIsStatusBarVisible);
    const [hoveredItem, setHoveredItem] = useState<string>();
    const dispatch = useDispatch();
    return (
        <footer className='footer h-12 border-t w-full bg-primary flex flex-row items-center'>
            <div className='w-full flex justify-end'>
                <div className='flex flex-row'>
                    <div
                        className='cursor-pointer flex flex-row'
                        onMouseEnter={() => setHoveredItem('hotspots')}
                        onMouseLeave={() => setHoveredItem('')}
                        onClick={() => dispatch(toggleHotspots())}>
                        <div className='items-center pr-2'>
                            <CalendarIcon className='cursor-pointer'/>
                        </div>
                        <div data-test-id='hotspots-toggle'
                             className={`pr-10 hidden md:block cursor-pointer ${hoveredItem === 'hotspots' ? 'body2-medium' : 'body2'}`}>
                            {t('footer.hotspots')}
                        </div>
                    </div>
                    <div
                        className="flex flex-row items-center"
                        onMouseEnter={() => setHoveredItem('statuses')}
                        onMouseLeave={() => setHoveredItem('')}
                        onClick={() => dispatch(toggleStatusBar())}>
                        <div
                            className={`pr-1 hidden md:block cursor-pointer ${hoveredItem === 'statuses' ? 'body2-medium' : 'body2'}`}>
                            {t('footer.status')}
                        </div>
                        <div>
                            {isStatusBarVisible ? <ArrowUpIcon className='cursor-pointer'/> :
                                <ArrowDownIcon className='cursor-pointer'/>}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
