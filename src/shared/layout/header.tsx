import React, {useRef} from 'react';
import { ReactComponent as MenuIcon } from '../icons/Icon-Menu-24px.svg';
import Avatar from '../../shared/components/avatar/avatar';
import { ReactComponent as AthenaIcon } from '../icons/Icon-Athena-24px.svg';
import { ReactComponent as MSIcon } from '../icons/Icon-Office365-24px.svg';
import SearchBar from '../components/search-bar/search-bar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNavigation, toggleUserProfileMenu } from './store/layout.slice';
import { authenticationSelector } from '../store/app-user/appuser.selectors';
import { isProfileMenuExpandedSelector } from './store/layout.selectors';
import HelioLogo from '../icons/helio-logo';
import customHooks from '../hooks/customHooks';
import ProfileDropdown from './components/profile-dropdown';
import utils from '../utils/utils';
import {UserStatus} from '../store/app-user/app-user.models';

const Header = () => {
    const dispatch = useDispatch();
    const auth = useSelector(authenticationSelector);
    const username = auth.name as string;
    const userInitials = auth.isLoggedIn ? utils.getInitialsFromFullName(username) : '';
    const isProfileMenuOpen = useSelector(isProfileMenuExpandedSelector);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const displayProfileMenu = () => {
        setTimeout(() => dispatch(toggleUserProfileMenu()), 100);
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        dispatch(toggleUserProfileMenu());
    });


    return (
        <header className='items-center flex px-7 justify-between flex-row bg-primary text-primary'>
            <div className='flex items-center justify-between h-16 w-full md:w-auto'>
                <div className='md:pr-14'>
                    <MenuIcon className='cursor-pointer' onClick={() => dispatch(toggleNavigation())}/>
                </div>
                <div>
                    <HelioLogo className='fill-current text-primary-600' />
                </div>
                <div className='block md:hidden cursor-pointer'>
                    <span onClick={() => displayProfileMenu()}>
                        <Avatar model={{
                            initials: userInitials,
                            status: UserStatus.Offline
                        }}/>
                    </span>
                    {isProfileMenuOpen && <ProfileDropdown/>}
                </div>
            </div>
            <div>
                <SearchBar />
            </div>
            <div className='flex flex-row items-center'>
                <div className='hidden md:block'>
                    <MSIcon className='cursor-pointer'/>
                </div>
                <div data-test-id='athena-icon' className='px-10 hidden md:block'>
                    <AthenaIcon className='cursor-pointer'/>
                </div>
                <div>
                    <div className='hidden h-full md:block relative'>
                        <div data-test-id='letter-avatar' className='cursor-pointer' onClick={() => displayProfileMenu()}>
                            <Avatar model={{
                                initials: userInitials,
                                status: UserStatus.Offline
                            }}/>
                        </div>
                        <div>
                            {isProfileMenuOpen && <div ref={dropdownRef} className='absolute right-0.5 top-11 z-10'><ProfileDropdown/></div>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
