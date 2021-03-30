import {ReactComponent as ArrowDownIcon} from '../icons/Icon-Arrow-down-16px.svg';
import {useTranslation} from 'react-i18next';
import {ReactComponent as CalendarIcon} from '../icons/Icon-Calendar-24px.svg';
import './footer.scss';
import {useDispatch} from 'react-redux';
import {toggleHotspots} from './store/layout.slice';

const Footer = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    return (
        <footer className='footer h-12 border-t w-full bg-primary flex flex-row items-center body2-medium'>
            <div className='w-full flex justify-end'>
                <div className='flex flex-row'>
                    <div className='cursor-pointer flex flex-row' onClick={() => dispatch(toggleHotspots())}>
                        <div className='items-center pr-2'>
                            <CalendarIcon className='cursor-pointer'/>
                        </div>
                        <div data-test-id='hotspots-toggle' className='pr-10 hidden md:block cursor-pointer'>
                            {t('footer.hotspots')}
                        </div>
                    </div>
                    <div className='pr-1'>
                        {t('footer.status')}
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownIcon className='cursor-pointer'/>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
