import { ReactComponent as CCPIcon } from '../icons/Icon-CCP-48px.svg';
import { ReactComponent as PhoneIcon } from '../icons/Icon-Phone-24px.svg';
import { ReactComponent as ChatIcon } from '../icons/Icon-Chat-24px.svg';
import { ReactComponent as PlaceholderIcon } from '../icons/Icon-Placeholder-24px.svg';
import { ReactComponent as ArrowDownIcon } from '../icons/Icon-Arrow-down-16px.svg';
import { useTranslation } from 'react-i18next';
const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="h-14 border-t flex-initial w-full bg-primary text-primary">
            <div className="flex flex-row justify-between w-full h-full">
                <div className="md:pl-96 flex flex-row items-center">
                    <div className="pr-5 hidden md:block">
                        <CCPIcon></CCPIcon>
                    </div>
                    <div className="pr-1 hidden md:block">
                        <PhoneIcon></PhoneIcon>
                    </div>
                    <div className="pr-5 text-gray-600 font-bold hidden md:block">0</div>
                    <div className="pr-1 hidden md:block">
                        <ChatIcon></ChatIcon>
                    </div>
                    <div className="text-gray-600 font-bold hidden md:block">0</div>
                </div>
                <div className="items-center flex flex-row pr-7 md:pr-36">
                    <div className="pr-4 hidden md:block">
                        <PlaceholderIcon></PlaceholderIcon>
                    </div>
                    <div className="pr-10 hidden md:block">
                        {t('footer.hotspots')}
                    </div>
                    <div className="pr-1">
                        {t('footer.status')}
                    </div>
                    <div>
                        <ArrowDownIcon className="cursor-pointer"></ArrowDownIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
