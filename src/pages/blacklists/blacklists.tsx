import Tabs, {Tab} from '@components/tab';
import BlacklistsTable from './components/blacklist-table';
import {BlockAccessType} from './models/blacklist.model';
import {useTranslation} from 'react-i18next';

const Blacklists = () => {
    const {t} = useTranslation();

    return (
        <div className="flex flex-col w-full h-full pt-6 overflow-y-auto">
            <div className='pb-6 pl-6'>
                <h5>{t('blacklist.title')}</h5>
            </div>
            <div className='h-full'>
                <Tabs>
                    <Tab title={t('blacklist.tabs_title.email')}>
                        <BlacklistsTable type={BlockAccessType.Email} />
                    </Tab>
                    <Tab title={t('blacklist.tabs_title.phone')}>
                        <BlacklistsTable type={BlockAccessType.Phone} />
                    </Tab>
                    <Tab title={t('blacklist.tabs_title.ip')}>
                        <BlacklistsTable type={BlockAccessType.IPAddress} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default Blacklists;
