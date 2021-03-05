import React from 'react';
import { ReactComponent as MenuIcon } from '../icons/Icon-Menu-24px.svg';
import { LettersAvatar } from '../icons/LettersAvatar';
import { ReactComponent as AthenaIcon } from '../icons/Icon-Athena-24px.svg';
import { ReactComponent as MSIcon } from '../icons/Icon-Office365-24px.svg';
import SearchBar from '../components/search-bar/search-bar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNavigation, toggleUserProfileMenu } from './store/layout.slice';
import { authenticationSelector } from '../store/app-user/appuser.selectors';
import { AuthenticationInfo } from '../store/app-user/app-user.models';
import { isProfileMenuExpandedSelector } from './store/layout.selectors';
import ProfileDropdown from './components/profile-dropdown';
import HelioLogo from '../icons/helio-logo';

const Header = () => {
    const dispatch = useDispatch();
    const auth = useSelector(authenticationSelector);
    const isProfileMenuOpen = useSelector(isProfileMenuExpandedSelector);

    return (
        <header className='items-center flex px-7 justify-between flex-row bg-primary text-primary'>
            <div className='flex items-center justify-between h-16 w-full md:w-auto'>
                <div className='md:pr-14'>
                    <MenuIcon className='cursor-pointer' onClick={() => dispatch(toggleNavigation())}/>
                </div>
                <div>
                    <HelioLogo className='fill-current text-primary-600' />                </div>
                <div className='block md:hidden cursor-pointer' onClick={() => dispatch(toggleUserProfileMenu())}>
                    <LettersAvatar initials={getInitialsFromAuth(auth)}/>
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
                    <div className='hidden h-full md:block relative' onClick={() => dispatch(toggleUserProfileMenu())}>
                        <div data-test-id='letter-avatar' className='cursor-pointer'>
                            <LettersAvatar initials={getInitialsFromAuth(auth)}/>
                        </div>
                        <div>
                            {isProfileMenuOpen && <ProfileDropdown/>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const getInitialsFromAuth = (auth: AuthenticationInfo): string => {
    if (auth.isLoggedIn) {
        const fullName = auth.name as string;
        const names = fullName.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    }
    return '';
}

export default Header;
