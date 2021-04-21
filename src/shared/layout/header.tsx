import React, {useRef} from 'react';
import Avatar from '@components/avatar/avatar';
import SearchBar from '../components/search-bar/search-bar';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCcp, toggleUserProfileMenu} from './store/layout.slice';
import {authenticationSelector, selectUserStatus} from '../store/app-user/appuser.selectors';
import {isProfileMenuExpandedSelector} from './store/layout.selectors';
import HelioLogo from '@icons/helio-logo';
import ProfileDropdown from './components/profile-dropdown';
import utils from '../utils/utils';
import customHooks from '../hooks/customHooks';
import {selectChatCounter, selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import './header.scss';
import {useHistory} from 'react-router-dom';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

const Header = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(authenticationSelector);
    const username = auth.name as string;
    const userInitials = auth.isLoggedIn ? utils.getInitialsFromFullName(username) : '';
    const isProfileMenuOpen = useSelector(isProfileMenuExpandedSelector);
    const avatarRef = useRef(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const numberOfAgentChats = useSelector(selectChatCounter);
    const numberOfAgentVoices = useSelector(selectVoiceCounter);
    const currentUserStatus = useSelector(selectUserStatus);

    const displayProfileMenu = () => {
        setTimeout(() => dispatch(toggleUserProfileMenu(true)), 100);
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        dispatch(toggleUserProfileMenu(false));
    });
    return (
        <header className='items-center border-b flex md:pl-6 flex-row bg-primary text-primary'>
            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-row'>
                    <div className='flex items-center h-16 w-full md:w-auto'>
                        <div className='pl-7 md:pl-0 pr-36'>
                            <div className='cursor-pointer' onClick={() => history.push('/')}>
                                <HelioLogo className='fill-current text-primary-600'/>
                            </div>
                        </div>
                    </div>
                    <div className='pl-2'>
                        <SearchBar/>
                    </div>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='cursor-pointer pr-4'>
                        <SvgIcon type={Icon.Ccp} data-test-id='toggle-ccp' className='icon-large-40' fillClass='header-active-item-icon' onClick={() => dispatch(toggleCcp())}/>
                    </div>
                    <div className='pr-1'>
                        <SvgIcon type={Icon.Phone} className='icon-small' fillClass='header-inactive-item-icon'/>
                    </div>
                    <div>
                        <div data-test-id='number-of-agent-voices'
                             className={'pr-5 hidden md:block subtitle'}><span
                            className={(numberOfAgentVoices > 0 ? 'header-active-agent-item' : 'text-disabled')}>{numberOfAgentVoices}</span>
                        </div>
                    </div>
                    <div className='pr-1.5'>
                        <SvgIcon type={Icon.Chat} className='icon-medium' fillClass='header-inactive-item-icon'/>
                    </div>
                    <div>
                        <div data-test-id='number-of-agent-chats'
                             className={'pr-20 hidden md:block subtitle'}><span
                            className={(numberOfAgentChats > 0 ? 'header-active-agent-item' : 'text-disabled')}>{numberOfAgentChats}</span>
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        <div className='hidden md:block pr-6'>
                            <SvgIcon type={Icon.Office365} className='cursor-pointer' opacity='0.596'/>
                        </div>
                        <div data-test-id='athena-icon' className='pr-10 hidden md:block'>
                            <SvgIcon type={Icon.Athena} className='cursor-pointer' opacity='0.55'/>
                        </div>
                        <div>
                            <div ref={dropdownRef} className='hidden h-full md:block relative'>
                                <div ref={avatarRef} data-test-id='letter-avatar' className='cursor-pointer pr-6'
                                     onClick={() => displayProfileMenu()}>
                                    <Avatar model={{
                                        initials: userInitials,
                                        status: currentUserStatus
                                    }}/>
                                </div>
                                <div>
                                    {isProfileMenuOpen &&
                                    <div ref={dropdownRef} className='absolute right-0.5 top-14 z-20 profile-dropdown'>
                                        <ProfileDropdown/></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
