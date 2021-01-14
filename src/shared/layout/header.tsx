import React from 'react';
import { ReactComponent as HelioLogo } from '../icons/helio-logo.svg';
import { ReactComponent as MenuIcon } from '../icons/Icon-Menu-24px.svg';
import { ReactComponent as LetterAvatar } from '../icons/Avatar-40px-Letters.svg';
import { ReactComponent as AthenaIcon } from '../icons/Icon-Athena-24px.svg';
import { ReactComponent as MSIcon } from '../icons/Icon-Office365-24px.svg';
import { useDispatch } from 'react-redux';
import { toggleNavigation } from './store/layout.slice';

const Header = () => {
    const dispatch = useDispatch();
    return (
        <header className="items-center border-b flex px-7 justify-between flex-row bg-primary text-primary">
            <div className="flex items-center justify-between h-18 w-full md:w-auto">
                <div className="md:pr-14">
                    <MenuIcon className="cursor-pointer" onClick={() => dispatch(toggleNavigation())}></MenuIcon>
                </div>
                <div>
                    <HelioLogo></HelioLogo>
                </div>
                <div className="block md:hidden">
                    <LetterAvatar className="cursor-pointer"></LetterAvatar>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="hidden md:block">
                    <MSIcon className="cursor-pointer"></MSIcon>
                </div>
                <div className="px-10 hidden md:block">
                    <AthenaIcon className="cursor-pointer"></AthenaIcon>
                </div>
                <div className="hidden md:block">
                    <LetterAvatar className="cursor-pointer"></LetterAvatar>
                </div>
            </div>
        </header>
    );
}

export default Header;
