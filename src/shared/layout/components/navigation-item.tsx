import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {isNavigationExpandedSelector} from '../store/layout.selectors';
import withErrorLogging from '../../HOC/with-error-logging';
import React, {useRef, useState} from 'react';
import './navigation-item.scss';
import {BadgeNumber} from '@icons/BadgeNumber';
import {clearTicketFilters, toggleTicketListFilter} from '@pages/tickets/store/tickets.slice';
import {setLastNavigationDate} from '../store/layout.slice';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import classnames from 'classnames';
import Tooltip from '@components/tooltip/tooltip';
import SvgIcon, { Icon } from '@components/svg-icon';

interface NavigationItemProps {
    title: string,
    link: string,
    icon: React.ReactNode,
    isSelected: boolean,
    displayBadge?: boolean,
    badgeValue?: number,
    permission?: string,
    teamValue?: number,
    myBadgeLabel?: string,
    teamBadgeLabel?: string,
}

const NavigationItem = ({title, link, icon, isSelected, displayBadge, badgeValue, permission, teamValue, myBadgeLabel, teamBadgeLabel}: NavigationItemProps) => {
    const {t} = useTranslation();
    const menuItem = useRef<HTMLDivElement>(null);
    const hasPermission = useCheckPermission(permission);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const isNavigationExpanded = useSelector(isNavigationExpandedSelector);
    const dispatch = useDispatch();
    const navigate = (link: string) => {
        dispatch(setLastNavigationDate());
        if (link.includes('tickets')) {
            dispatch(clearTicketFilters());
        }
        dispatch(toggleTicketListFilter(false));
    }

    if (!hasPermission) {
        return <></>;
    }
    return (
        <><div ref={menuItem} onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)} className={classnames('hover:bg-secondary-50 border-r', {'bg-secondary-50': isSelected})}>
            <div className='flex flex-row'>
                {<div className={'w-1.5 ' + (isSelected ? 'bg-green-400' : '')} />}
                <Link to={link} onClick={() => navigate(link)}>
                    <div className={(isSelected ? 'subtitle2' : 'body2-medium')}>
                        <div className={'items-center flex h-14  navigation-item-active cursor-pointer ' + (isNavigationExpanded ? 'w-62' : 'w-20')}>
                            <div>{icon}</div>
                            {displayBadge && <div className='flex items-center pb-4'><SvgIcon fillClass={displayBadge && !badgeValue ? 'info-icon' : 'danger-icon'} type={Icon.Indicator} /></div>}
                            {isNavigationExpanded &&
                                <div className='grid grid-rows-1 grid-flow-col gap-1 w-full pl-4'>
                                    <div className={displayBadge ? 'w-20' : ''}>
                                        {t(title)}
                                    </div>
                                    {displayBadge && (
                                        <>
                                            <div className='flex justify-start items-center'>
                                                <BadgeNumber type='red' number={badgeValue} hideIfZero={true} wideAutoIfLarger={true} />
                                            </div>
                                            <div className='flex justify-start items-center'>
                                                <BadgeNumber type='blue' number={teamValue} hideIfZero={true} wideAutoIfLarger={true} />
                                            </div>
                                        </>
                                    )}
                                    
                                </div>
                            }
                        </div>
                    </div>
                </Link>
            </div>
        </div>
        <Tooltip targetRef={menuItem} isVisible={tooltipVisible && !isNavigationExpanded && !displayBadge} placement='right'>
            <div className='p-3'>{t(title)}</div>
        </Tooltip>
        <Tooltip targetRef={menuItem} isVisible={tooltipVisible && !isNavigationExpanded && displayBadge == true} placement='right'>
            <div className='p-3 h-16 w-44 px-4 py-4'>
                <div className='flex flex-row items-center justify-between w-full'>
                    <div className='body3-medium w-36'>
                        {myBadgeLabel && t(myBadgeLabel)}
                    </div>
                    <div className='flex justify-end w-16'>
                        <BadgeNumber type='red' number={badgeValue} hideIfZero={false} wideAutoIfLarger={true} />
                    </div>
                </div>
                <div className='flex flex-row items-center justify-between w-full pt-1'>
                    <div className='body3-medium w-48'>
                        {teamBadgeLabel && t(teamBadgeLabel)}
                    </div>
                    <div className='flex justify-end w-16'>
                        <BadgeNumber type='blue' number={teamValue} tooltipOnOverflow={true} hideIfZero={false} wideAutoIfLarger={true} />
                    </div>
                </div>
                
            </div>
        </Tooltip></>);
}

export default withErrorLogging(NavigationItem);
