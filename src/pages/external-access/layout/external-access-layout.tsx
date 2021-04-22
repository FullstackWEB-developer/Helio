import {ReactNode} from 'react';
import './external-access-layout.scss';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

export interface ExternalAccessLayoutProps {
    children: ReactNode;
}

const ExternalAccessLayout = ({children} : ExternalAccessLayoutProps) => {
    const {t} = useTranslation();
    const year = dayjs().year();
    return <>
        <div className='flex flex-col h-screen'>
            <div className='h-20 md:px-40 external-access-layout-header'>
                <div className='md:px-6 md:justify-start justify-center flex h-full items-center'>
                    {t('external_access.cwc_logo')}
                </div>
            </div>
            <div className='flex-grow overflow-y-auto px-8 md:px-40 pt-6 md:pt-14'>{children}</div>
            <div className='h-16 md:px-40 external-access-layout-footer body3-medium'>
                <div className='h-full px-16 flex items-center text-center'>
                    {t('external_access.copyright', {'year': year})}
                </div>
            </div>
        </div>
    </>
}
export default ExternalAccessLayout;
