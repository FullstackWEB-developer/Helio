import React, {useEffect, useRef, useState} from 'react';
import Avatar from '@components/avatar/avatar';
import SearchBar from '../components/search-bar/search-bar';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCcp, toggleUserProfileMenu} from './store/layout.slice';
import {authenticationSelector, selectUserStatus} from '../store/app-user/appuser.selectors';
import {isCcpVisibleSelector, isProfileMenuExpandedSelector} from './store/layout.selectors';
import HelioLogo from '@icons/helio-logo';
import ProfileDropdown from './components/profile-dropdown';
import customHooks from '../hooks/customHooks';
import {selectChatCounter, selectConnectionStatus, selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import './header.scss';
import {useHistory} from 'react-router-dom';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {CCP_ANIMATION_DURATION} from '@constants/form-constants';
import {getUserByEmail} from '@shared/services/user.service';
import {useQuery} from 'react-query';
import {QueryUserById} from '@constants/react-query-constants';
import {setAuthentication} from '@shared/store/app-user/appuser.slice';
import {AuthenticationInfo} from '@shared/store/app-user/app-user.models';
import {CCPConnectionStatus} from '@pages/ccp/models/connection-status.enum';
import Tooltip from '@components/tooltip/tooltip';
import {Trans, useTranslation} from 'react-i18next';


const Header = ({headsetIconRef}: {headsetIconRef: React.RefObject<HTMLDivElement>}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const auth: AuthenticationInfo = useSelector(authenticationSelector);
    const username = auth.name as string;
    const isProfileMenuOpen = useSelector(isProfileMenuExpandedSelector);
    const avatarRef = useRef(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const numberOfAgentChats = useSelector(selectChatCounter);
    const numberOfAgentVoices = useSelector(selectVoiceCounter);
    const currentUserStatus = useSelector(selectUserStatus);
    const isCcpVisible = useSelector(isCcpVisibleSelector);
    const ccpConnectionState = useSelector(selectConnectionStatus);
    const iconContainerRef = useRef(null);
    const [isErrorToolTipVisible, setErrorToolTipVisible] = useState(true);

    const setUserPicture = async () => {
        if (!auth || !auth.username) {
            return '';
        }

        const users = await getUserByEmail(auth.username);
        if (!users?.results || users?.results.length < 1) {
            return '';
        }
        const user = users.results[0];

        const enriched = {
            ...auth,
            profilePicture: user.profilePicture,
            id: user.id
        };
        dispatch(setAuthentication(enriched));
        return user.profilePicture;
    }

    const {data: profilePicture} = useQuery<string | undefined, Error>([QueryUserById, auth.username], () => setUserPicture(),
        {
            enabled: !!auth?.username && !auth.profilePicture
        });

    const [animate, setAnimate] = useState(false);
    const [ccpOpened, setCcpOpened] = useState(false);

    useEffect(() => {
        if (isCcpVisible) {
            setCcpOpened(true);
        }

        if (!isCcpVisible && ccpOpened) {
            setAnimate(true);
        }

        let animationTimer = setTimeout(() => {
            setAnimate(false)
        }, CCP_ANIMATION_DURATION * 1000);

        return () => {
            clearTimeout(animationTimer);
        }
    }, [isCcpVisible, ccpOpened]);

    const openUrl = (address: string) => {
        window.open(address, '_blank');
    }

    const displayProfileMenu = () => {
        setTimeout(() => dispatch(toggleUserProfileMenu(true)), 100);
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        dispatch(toggleUserProfileMenu(false));
    });
    return (
        <header className='flex flex-row items-center border-b md:pl-6 bg-primary text-primary'>
            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-row'>
                    <div className='flex items-center w-full h-16 md:w-auto'>
                        <div className='pl-7 md:pl-0 pr-36'>
                            <div className='cursor-pointer' onClick={() => history.push('/dashboard')}>
                                <HelioLogo className='fill-current text-primary-600' />
                            </div>
                        </div>
                    </div>
                    <div className='pl-2'>
                        <SearchBar />
                    </div>
                </div>
                <div className='flex flex-row items-center'>
                    <div ref={headsetIconRef} className='relative mr-4 cursor-pointer'>
                        <SvgIcon type={Icon.Ccp} data-test-id='toggle-ccp'
                            className={`${animate ? 'icon-large-40 animate-pulse' : 'icon-large-40'}`}
                            fillClass={`${animate ? 'header-active-item-icon header-animation-fill' : 'header-active-item-icon'}`}
                            onClick={() => dispatch(toggleCcp())} />
                        {ccpConnectionState === CCPConnectionStatus.Failed &&
                            <div ref={iconContainerRef}
                                onClick={() => setErrorToolTipVisible(!isErrorToolTipVisible)}
                                className='absolute bottom-0 right-0'>
                                <SvgIcon
                                    type={Icon.ErrorFilled}
                                    className='icon-small'
                                    fillClass='danger-icon'
                                />
                                <Tooltip
                                    targetRef={iconContainerRef}
                                    isVisible={isErrorToolTipVisible}
                                    placement='bottom-start'>
                                    <div className="flex flex-col p-6 body2 w-80">
                                        <span>{t('ccp.modal.desc_fail')}</span>
                                        <span>
                                            <Trans i18nKey="ccp.modal.desc_fail_try" values={{email: process.env.REACT_APP_HELIO_SUPPORT_EMAIL}}>
                                                <a rel='noreferrer' className='link' href={`mailto:${process.env.REACT_APP_HELIO_SUPPORT_EMAIL}`}> </a>
                                            </Trans>
                                        </span>
                                    </div>
                                </Tooltip>
                            </div>
                        }
                    </div>
                    <div className='pr-1'>
                        <SvgIcon type={Icon.Phone} className='icon-small' fillClass='header-inactive-item-icon' />
                    </div>
                    <div>
                        <div data-test-id='number-of-agent-voices'
                            className={'pr-5 hidden md:block subtitle'}><span
                                className={(numberOfAgentVoices > 0 ? 'header-active-agent-item' : 'text-disabled')}>{numberOfAgentVoices}</span>
                        </div>
                    </div>
                    <div className='pr-1.5'>
                        <SvgIcon type={Icon.Chat} className='icon-medium' fillClass='header-inactive-item-icon' />
                    </div>
                    <div>
                        <div data-test-id='number-of-agent-chats'
                            className={'pr-20 hidden md:block subtitle'}><span
                                className={(numberOfAgentChats > 0 ? 'header-active-agent-item' : 'text-disabled')}>{numberOfAgentChats}</span>
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        <div className='hidden pr-6 md:block'>
                            <SvgIcon type={Icon.AwsConnect}
                                     className='cursor-pointer header-icon'
                                     onClick={() => openUrl(`${process.env.REACT_APP_CONNECT_BASE_URL}connect/home`)} />
                        </div>
                        <div data-test-id='athena-icon' className='hidden pr-10 md:block'>
                            <SvgIcon type={Icon.Athena} className='cursor-pointer header-icon' onClick={() => openUrl(`${process.env.REACT_APP_ATHENAHEALTH}`)}/>
                        </div>
                        <div>
                            <div ref={dropdownRef} className='relative hidden h-full md:block'>
                                <div ref={avatarRef} data-test-id='letter-avatar' className='pr-6 cursor-pointer'
                                    onClick={() => displayProfileMenu()}>
                                    <Avatar userFullName={auth.isLoggedIn ? username : ''} status={currentUserStatus} userPicture={auth.profilePicture ?? profilePicture} />
                                </div>
                                <div>
                                    {isProfileMenuOpen &&
                                        <div ref={dropdownRef} className='absolute right-0.5 top-14 z-20 profile-dropdown'>
                                            <ProfileDropdown /></div>}
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
