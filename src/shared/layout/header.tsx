import React, { useEffect, useRef, useState } from 'react';
import Avatar from '@components/avatar/avatar';
import SearchBar from '../components/search-bar/search-bar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCcp, toggleUserProfileMenu } from './store/layout.slice';
import { authenticationSelector, selectAppUserDetails, selectUserStatus } from '../store/app-user/appuser.selectors';
import { incomingOrActiveCallInProgressSelector, isCcpVisibleSelector, isProfileMenuExpandedSelector } from './store/layout.selectors';
import HelioLogo from '@icons/helio-logo';
import ProfileDropdown from './components/profile-dropdown';
import customHooks from '../hooks/customHooks';
import { selectConnectionStatus } from '@pages/ccp/store/ccp.selectors';
import './header.scss';
import { Link } from 'react-router-dom';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import { CCP_ANIMATION_DURATION } from '@constants/form-constants';
import { AuthenticationInfo } from '@shared/store/app-user/app-user.models';
import { CCPConnectionStatus } from '@pages/ccp/models/connection-status.enum';
import Tooltip from '@components/tooltip/tooltip';
import { Trans, useTranslation } from 'react-i18next';
import utils from '@shared/utils/utils';
import ComponentPermissionGuard from "@components/component-permission-guard";
import ReLoginModal from '@shared/layout/components/relogin-modal';
import classNames from 'classnames';
import Alert from '@components/alert/alert';
import CallbackTicketCount from '@shared/layout/components/callback-ticket-count';

const Header = ({ headsetIconRef }: { headsetIconRef: React.RefObject<HTMLDivElement> }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const appUserDetails = useSelector(selectAppUserDetails);
    const auth: AuthenticationInfo = useSelector(authenticationSelector);
    const isProfileMenuOpen = useSelector(isProfileMenuExpandedSelector);
    const avatarRef = useRef(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isCcpVisible = useSelector(isCcpVisibleSelector);
    const ccpConnectionState = useSelector(selectConnectionStatus);
    const userStatus = useSelector(selectUserStatus);
    const iconContainerRef = useRef(null);
    const [isErrorToolTipVisible, setErrorToolTipVisible] = useState(true);
    const [animate, setAnimate] = useState(false);
    const [ccpOpened, setCcpOpened] = useState(false);
    const isIncomingOrActiveCall = useSelector(incomingOrActiveCallInProgressSelector);

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
        if (isProfileMenuOpen) {
            dispatch(toggleUserProfileMenu(false));
        }
    });

    customHooks.useOutsideClick([iconContainerRef], () => {
        if (isErrorToolTipVisible) {
            setErrorToolTipVisible(false);
        }
    });
    return (
        <header className='flex flex-row items-center border-b md:pl-6 bg-primary text-primary'>
            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-row'>
                    <div className='flex items-center w-full h-16 md:w-auto'>
                        <div className='pl-7 md:pl-0 pr-36'>
                            <Link to='/dashboard' className='cursor-pointer'>
                                <div>
                                    <HelioLogo className='fill-current text-primary-600' />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className='pl-2'>
                        <SearchBar />
                    </div>
                    <div><ReLoginModal type='header' /></div>
                </div>

                {appUserDetails && appUserDetails?.callForwardingEnabled && <div className='flex w-full max-h-16 h-16 items-center justify-end pr-4'>
                    <Alert message={'ccp.call_chat_fw_enabled_header'} type='info'/>
                </div>}
                <div className='flex flex-row items-center'>

                    <CallbackTicketCount />
                    <div ref={headsetIconRef} className='relative cursor-pointer mr-32'>
                        <div className={classNames({ 'ccp-incoming-pulse': isIncomingOrActiveCall, 'ccp-idle-border': !isIncomingOrActiveCall })} onClick={() => dispatch(toggleCcp())}>
                            <SvgIcon type={Icon.Ccp} data-test-id='toggle-ccp'
                                className={classNames('icon-large-40', { 'animate-pulse': animate })}
                                fillClass2={`${isIncomingOrActiveCall ? 'ccp-icon-active-headset' : 'ccp-icon-idle-headset'}`}
                                fillClass={`${isIncomingOrActiveCall ? 'ccp-icon-active-background' : 'ccp-icon-idle-background'}`} />
                        </div>
                        {ccpConnectionState === CCPConnectionStatus.Failed &&
                            <div ref={iconContainerRef}
                                onClick={() => setErrorToolTipVisible(!isErrorToolTipVisible)}
                                className='absolute bottom-0 left-7'>
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
                                            <Trans i18nKey="ccp.modal.desc_fail_try" values={{ email: utils.getAppParameter('SupportEmailAddress') }}>
                                                <a rel='noreferrer' className='link' href={`mailto:${utils.getAppParameter('SupportEmailAddress')}`}> </a>
                                            </Trans>
                                        </span>
                                    </div>
                                </Tooltip>
                            </div>
                        }
                    </div>
                    <div className='flex flex-row items-center'>
                        <div data-test-id='help-icon' className='hidden pr-6 md:block'>
                            <SvgIcon type={Icon.Help} className='cursor-pointer header-icon' onClick={() => openUrl(`#`)} />
                        </div>
                        <ComponentPermissionGuard permission='Home.AWSConnectButton'>
                            <div className='hidden pr-6 md:block'>
                                <SvgIcon
                                    type={Icon.AwsConnect}
                                    className='cursor-pointer header-icon'
                                    onClick={() => openUrl(`${utils.getAppParameter('ConnectBaseUrl')}connect/home`)}
                                />
                            </div>
                        </ComponentPermissionGuard>
                        <div className='hidden pr-6 md:block'>
                            <SvgIcon type={Icon.Office365} className='cursor-pointer header-icon'  onClick={()=>openUrl('https://www.office.com/')} />
                        </div>
                        <div data-test-id='athena-icon' className='hidden pr-10 md:block'>
                            <SvgIcon type={Icon.Athena} className='cursor-pointer header-icon' onClick={() => openUrl(utils.getAppParameter('AthenaHealthUrl'))} />
                        </div>

                        <div>
                            <div ref={dropdownRef} className='relative hidden h-full md:block'>
                                <div ref={avatarRef} data-test-id='letter-avatar' className='pr-6 cursor-pointer'
                                    onClick={() => displayProfileMenu()}>
                                    <Avatar userFullName={auth.isLoggedIn && appUserDetails ? appUserDetails.fullName : ''}
                                        userId={appUserDetails?.id}
                                        displayStatus={true}
                                        status={userStatus}
                                        userPicture={appUserDetails?.profilePicture} />
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
