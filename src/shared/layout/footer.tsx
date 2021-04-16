import {useTranslation} from 'react-i18next';
import './footer.scss';
import {useDispatch, useSelector} from 'react-redux';
import {toggleHotspots, toggleStatusBar} from './store/layout.slice';
import {selectIsStatusBarVisible} from './store/layout.selectors';
import React, {useState} from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

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
                            <SvgIcon type={Icon.Calendar} className='cursor-pointer' fillClass='active-item-icon'/>
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
                            {isStatusBarVisible ? <SvgIcon type={Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon'/> :
                                <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon'/>}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
